'use strict';

const fs = require('fs');

const amdclean = require('amdclean'),
	gzip = require('gzip-js'),
	loadGruntTasks = require('load-grunt-tasks');

const builds = require('./build/config');
const browserBuild = builds['browser'];
const serverBuild = builds['server'];

const buildNames = Object.keys(builds).filter(
	key => key !== 'options'
);
const buildOptions = builds['options'];

module.exports = grunt => {

	const forEachBuild = (fn, thisArg) => {

		const fnResults = buildNames.map(async key => {
			return fn.call(thisArg, builds[key], key);
		});

		return thisArg || fnResults;

	};

	loadGruntTasks(grunt);

	grunt.initConfig({
		'copy': {
			'build-src': {
				'cwd': './src',
				'src': ['**'],
				'dest': buildOptions.getPath('src'),
				'expand': true
			},
			'build-test': {
				'cwd': './test',
				'src': ['**'],
				'dest': buildOptions.getPath('test'),
				'expand': true
			},
			'dist': {
				'cwd': buildOptions.getPath('mutableProduction'),
				'src': ['**'],
				'dest': buildOptions.getPath('production'),
				'expand': true
			}
		},
		'clean': {
			'builds': {
				'src': [
					buildOptions.getPath() + '/*',
					'!' + buildOptions.getPath() + '/config.js'
				]
			}
		},
		// Builds all the code into some mutable bundle.
		'requirejs': forEachBuild(function (build, name) {
			
			const distOptions = {
				'findNestedDependencies': true,
				'optimize': 'none',
				'skipModuleInsertion': true,
				'skipSemiColonInsertion': true,
				onBuildRead (moduleName, path, contents) {
					return buildOptions.replaceVars(contents);
				},
				onModuleBundleComplete (data) {
					
					const {path} = data;
					const content = amdclean.clean({
						'filePath': path,
						'wrap': {
							// Adds a banner, and exports
							// the bundle to AMD, node or `this`.
							'start': '(function (root, factory) {\n' +
							'	if (typeof define === "function" && define.amd) { define("APR", factory); }\n' +
							'	else if (typeof exports === "object") { module.exports = factory(); }\n' +
							'	else { root.APR = factory(); }\n' +
							'}(this, function () {\n',
							'end': '\n\treturn APR;\n}));'
						},
						'aggressiveOptimizations': true,
						'escodegen': {
							// Some comments still being removed
							// in version 2.7.0
							'comment': true,
							'format': {
								'indent': {
									'base': 1,
									'style': '\t',
									'adjustMultilineComment': false
								}
							}
						},
						// Removes the path and the extension
						// from all the variables.
						// src/lib/someModule_js -> someModule
						prefixTransform (postNormalizedModuleName, preNormalizedModuleName) {
							return preNormalizedModuleName.replace(/^.*\//, '').replace(/\.js$/, '');
						}
					});
					var header = buildOptions.banner;

					if (build.polyfillsSrc) {
						header += fs.readFileSync(
							build.polyfillsSrc,
							'utf8'
						);
					}

					fs.writeFileSync(path, header + content);

				}

			};

			const out = buildOptions
				.getPath('mutableProduction') + '/' + name + '.js';

			this['bundle-dist-' + name] = {
				'options': {
					'baseUrl': buildOptions.getPath(),
					'include': build.files,
					'out': out,
					...distOptions
				}
			};

		}, {}),
		'browserify': {
			// Convert the amd modules into `require`s,
			// and bundle them into one single file.
			'bundle-test-tape': {
				'options': {
					'transform': ['deamdify', [
						// Fixes karma error 0 of 0. 
                    	'browserify-replace', {
							'replace': [{
								'from': /require\((\"|\')tape(\"|\')\)/g,
								'to': 'typeof tape !== "undefined" ? tape : require("tape")'
							}]
						}
					]]
				},
				'files': forEachBuild(function (build, name) {
						
					const path = buildOptions.getPath('test-tape');
					const out = buildOptions
						.getUnitTestFilename(path + '/' + name, 'build');

					this[out] = build.files.map(
						file => path + '/' + buildOptions.getUnitTestFilename(file)
					);

				}, {})
			}
		},
		'tape': {
			// TAP won't work with amd modules. Files need
			// to be converted first in order to be tested. 
			'unit-server': {
				'options': {
					'pretty': true,
					'output': 'console'
				},
				'src': [
					serverBuild.polyfillsSrc,
					buildOptions.getPath('test-tape') +
						'/' + buildOptions.getUnitTestFilename('server', 'build')
				].filter(v => v)
			}
		},
		'karma': (() => {

			const publicDir = buildOptions
				.getPath('test-server')
				.replace('./', '') +
				'/public';

			const commonConfigurations = {
				'files': [
					{
						'src': publicDir + '/*',
						'included': false,
						'served': true
					}, {
						'src': [
							browserBuild.polyfillsSrc,
							buildOptions.getPath('test-tape') + '/' +
								buildOptions.getUnitTestFilename('browser', 'build')
						].filter(v => v)
					}
				]
			};

			return {
				'options': {
					'failOnEmptyTestSuite': false,
					'frameworks': ['tap'],
					'reporters': ['progress', 'coverage'],
					'preprocessors': {
						'./src/lib/**/*.js': ['coverage']
					},
					'proxies': {
						'/assets/': '/base/' + publicDir + '/'
					},
					'browsers': ['jsdom'],
					'background': true,
					'singleRun': true
				},
				'unit-browser': {
					...commonConfigurations
				},
				'unit-browser-dev': {
					'singleRun': false,
					'background': false,
					'browsers': ['Firefox', 'IE'],
					...commonConfigurations
				}
			};

		})(),
		'uglify': {
			'options': {
				'preserveComments': false,
				'report': 'min',
				'output': {
					'ascii_only': true
				},
				'banner': buildOptions.banner,
				'compress': {
					'hoist_funs': false,
					'loops': false
				},
				'mangle': true
			},
			'dist': {
				'files': forEachBuild(function (build, name) {

					const productionPath = buildOptions.getPath('production');
					const mutableProductionPath = buildOptions.getPath('mutableProduction');
					const out = productionPath + '/' + name + '.min.js';

					this[out] = [
						mutableProductionPath + '/' + name + '.js'
					];

				}, {})
			}
		},
		'compare_size': {
			'options': {
				'compress': {
					gz (fileContents) {
						return gzip.zip(fileContents, {}).length;
					}
				}
			},
			'build': {
				'options': {
					'cache': buildOptions.getPath() +
						'/.sizecache.json'
				},
				'src': buildNames.map(
					name => buildOptions.getPath('mutableProduction') +
						'/' + name + '.js'
				)
			},
			'dist': {
				'options': {
					'cache': buildOptions.getPath('production') +
						'/.sizecache.json'
				},
				'src': buildNames.map(
					name => buildOptions.getPath('production') +
						'/' + name + '*.js'
				)
			}
		}
	});

	grunt.registerTask('init', [
		'clean:builds',
		'copy:build-src',
		'copy:build-test'
	]);
	grunt.registerTask('bundle', [
		'requirejs',
		'browserify',
		'compare_size:build'
	]);
	grunt.registerTask('test', [
		serverBuild.testSuite + ':unit-server',
		browserBuild.testSuite + ':unit-browser'
	]);
	grunt.registerTask('distribute', [
		'copy:dist',
		'uglify:dist',
		'compare_size:dist'
	]);

	grunt.registerTask('default', [
		'init',
		'bundle',
		'test',
		'distribute'
	]);
	grunt.registerTask('dev', [
		'default',
		'karma:unit-browser-dev'
	]);

};