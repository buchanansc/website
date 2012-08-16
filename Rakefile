require "rake"
require "jekyll"
require 'compass'

CONFIG = {
	'root' => File.dirname(__FILE__),
	'compass_project' => '_scss',
}

task :default do
	system("rake -sT")
end

desc 'Switch to the development environment'
task :development => ["clean", "compass:development", "jekyll:development"]

desc 'Switch to the production environment'
task :production => ["clean", "compass:production", "optipng", "jekyll:production", "grunt"]

desc 'Clean all cache and generated files'
task :clean => ["compass:clean", "jekyll:clean"]

task :grunt do
	system("grunt")
end
task :optipng do
	if dir = compassConfig('images_dir') then
		path = File.expand_path(dir, File.join(CONFIG['root'], CONFIG['compass_project']))
		system("find '#{path}' -type f -name '*.png' | xargs optipng -quiet -preserve")
	end
end

namespace :jekyll do
	task :development do
		@site = Jekyll::Site.new(Jekyll.configuration({ 'environment' => "development" }))
		@site.process
	end
	task :production do
		@site = Jekyll::Site.new(Jekyll.configuration({ 'environment' => "production" }))
		@site.process
	end
	task :clean do
		path = Jekyll.configuration({})['destination']
		if (File.expand_path(CONFIG['root']) != path && File.directory?(path)) then
			puts "Removing #{path}"
			FileUtils.rm_rf(path)
		end
	end
	task :server do
		system("open 'http://#{`echo "$HOSTNAME"`.chomp}:" + Jekyll.configuration({})['server_port'].to_s + "'")
		exec "jekyll", "--server", "--auto"
	end
end

def compassConfig(param)
	Compass.configuration_for(File.join(CONFIG['root'], CONFIG['compass_project'], 'config.rb')).instance_variable_get('@' + param)
end

namespace :compass do
	task :clean do
		system("cd '" + File.join(CONFIG['root'], CONFIG['compass_project']) + "' &>/dev/null && compass clean")
	end
	task :development do
		system("cd '" + File.join(CONFIG['root'], CONFIG['compass_project']) + "' &>/dev/null && compass compile -e development")
	end
	task :production do
		system("cd '" + File.join(CONFIG['root'], CONFIG['compass_project']) + "' &>/dev/null && compass compile -e production --force")
	end
	task :watch do
		Dir.chdir(File.join(CONFIG['root'], CONFIG['compass_project']))
		exec "compass", "watch", "--environment", "development"
	end
end
