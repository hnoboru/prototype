require 'rake'
require 'rake/packagetask'

PROTOTYPE_ROOT          = File.expand_path(File.dirname(__FILE__))
PROTOTYPE_SRC_DIR       = File.join(PROTOTYPE_ROOT, 'src')
PROTOTYPE_DIST_DIR      = File.join(PROTOTYPE_ROOT, 'dist')
PROTOTYPE_DOC_DIR       = File.join(PROTOTYPE_ROOT, 'doc')
PROTOTYPE_PKG_DIR       = File.join(PROTOTYPE_ROOT, 'pkg')
PROTOTYPE_TEST_DIR      = File.join(PROTOTYPE_ROOT, 'test')
PROTOTYPE_TEST_UNIT_DIR = File.join(PROTOTYPE_TEST_DIR, 'unit')
PROTOTYPE_TMP_DIR       = File.join(PROTOTYPE_TEST_UNIT_DIR, 'tmp')
PROTOTYPE_VERSION       = '1.6.0.3'

$:.unshift File.join(PROTOTYPE_ROOT, 'lib')

task :default => [:dist, :dist_helper, :package, :clean_package_source]

desc "Builds the distribution."
task :dist do
  require 'protodoc'

  File.open(File.join(PROTOTYPE_DIST_DIR, 'prototype.js'), 'w+') do |dist|
    source = File.join(PROTOTYPE_SRC_DIR, 'prototype.js')
    dist << Protodoc::Preprocessor.new(source, :strip_documentation => true)
  end
end

namespace :doc do
  desc "Builds the documentation."
  task :build => [:require] do
    require 'protodoc'
    require 'tempfile'

    Tempfile.open("prototype-doc") do |temp|
      source = File.join(PROTOTYPE_SRC_DIR, 'prototype.js')
      temp << Protodoc::Preprocessor.new(source, :strip_documentation => false)
      temp.flush
      rm_rf PROTOTYPE_DOC_DIR
      PDoc::Runner.new(temp.path, :output => PROTOTYPE_DOC_DIR).run
    end
  end  
  
  task :require do
    lib = 'vendor/pdoc/lib/pdoc'
    unless File.exists?(lib)
      puts "\nYou'll need PDoc to generate the documentation. Just run:\n\n"
      puts "  $ git submodule init"
      puts "  $ git submodule update"
      puts "\nand you should be all set.\n\n"
    end
    require lib
  end
end

task :doc => ['doc:build']

desc "Builds the updating helper."
task :dist_helper do
  require 'protodoc'

  File.open(File.join(PROTOTYPE_DIST_DIR, 'prototype_update_helper.js'), 'w+') do |dist|
    source = File.join(PROTOTYPE_ROOT, 'ext', 'update_helper', 'prototype_update_helper.js')
    dist << Protodoc::Preprocessor.new(source)
  end
end

Rake::PackageTask.new('prototype', PROTOTYPE_VERSION) do |package|
  package.need_tar_gz = true
  package.package_dir = PROTOTYPE_PKG_DIR
  package.package_files.include(
    '[A-Z]*',
    'dist/prototype.js',
    'lib/**',
    'src/**',
    'test/**'
  )
end

task :clean_package_source do
  rm_rf File.join(PROTOTYPE_PKG_DIR, "prototype-#{PROTOTYPE_VERSION}")
end

task :test => ['test:build', 'test:run']
namespace :test do
  desc 'Runs all the JavaScript unit tests and collects the results'
  task :run => [:require] do
    testcases        = ENV['TESTCASES']
    browsers_to_test = ENV['BROWSERS'] && ENV['BROWSERS'].split(',')
    tests_to_run     = ENV['TESTS'] && ENV['TESTS'].split(',')
    runner           = UnittestJS::WEBrickRunner::Runner.new(:test_dir => PROTOTYPE_TMP_DIR)

    Dir[File.join(PROTOTYPE_TMP_DIR, '*_test.html')].each do |file|
      file = File.basename(file)
      test = file.sub('_test.html', '')
      unless tests_to_run && !tests_to_run.include?(test)
        runner.add_test(file, testcases)
      end
    end
    
    UnittestJS::Browser::SUPPORTED.each do |browser|
      unless browsers_to_test && !browsers_to_test.include?(browser)
        runner.add_browser(browser.to_sym)
      end
    end
    
    trap('INT') { runner.teardown; exit }
    runner.run
  end
  
  task :build => [:clean, :dist] do
    builder = UnittestJS::Builder::SuiteBuilder.new({
      :input_dir  => PROTOTYPE_TEST_UNIT_DIR,
      :assets_dir => PROTOTYPE_DIST_DIR
    })
    selected_tests = (ENV['TESTS'] || '').split(',')
    builder.collect(*selected_tests)
    builder.render
  end
  
  task :clean => [:require] do
    UnittestJS::Builder.empty_dir!(PROTOTYPE_TMP_DIR)
  end
  
  task :require do
    lib = 'vendor/unittest_js/lib/unittest_js'
    unless File.exists?(lib)
      puts "\nYou'll need UnittestJS to run the tests. Just run:\n\n"
      puts "  $ git submodule init"
      puts "  $ git submodule update"
      puts "\nand you should be all set.\n\n"
    end
    require lib
  end
end

task :test_units do
  puts '"rake test_units" is deprecated. Please use "rake test" instead.'
end

task :build_unit_tests do
  puts '"rake test_units" is deprecated. Please use "rake test:build" instead.'
end

task :clean_tmp do
  puts '"rake clean_tmp" is deprecated. Please use "rake test:clean" instead.'
end

namespace :caja do
  task :test => ['test:build', 'test:run']
  
  namespace :test do
    task :run => ['rake:test:run']

    task :build => [:require, 'rake:test:clean', :dist] do 
      builder = UnittestJS::CajaBuilder::SuiteBuilder.new({
        :input_dir          => PROTOTYPE_TEST_UNIT_DIR,
        :assets_dir         => PROTOTYPE_DIST_DIR,
        :whitelist_dir      => File.join(PROTOTYPE_TEST_DIR, 'unit', 'caja_whitelists'),
        :html_attrib_schema => 'html_attrib.json'
      })
      selected_tests = (ENV['TESTS'] || '').split(',')
      builder.collect(*selected_tests)
      builder.render
    end
  end
  task :require => ['rake:test:require'] do
    lib = 'vendor/caja_builder/lib/caja_builder'
    unless File.exists?(lib)
      puts "\nYou'll need UnittestJS to run the tests. Just run:\n\n"
      puts "  $ git submodule init"
      puts "  $ git submodule update"
      puts "\nand you should be all set.\n\n"
    end
    require lib
  end
end