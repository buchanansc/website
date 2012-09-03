require "rake"
require "jekyll"
require "compass"

CONFIG = {
	'root' => File.dirname(__FILE__),
	'compass_project' => '_scss',
}

task :default do
	exec "rake -sf '#{__FILE__}' -T"
end

desc "Switch to the development environment"
task :development => ["clean", "compass:development", "jekyll:development", "jekyll:run"]

desc "Switch to the production environment"
task :production => ["clean", "compass:production", "optipng", "jekyll:production", "jekyll:run", "grunt"]

desc "Clean all cache and generated files"
task :clean => ["compass:clean", "jekyll:clean"]

desc "Run grunt"
task :grunt do
	system "grunt"
end

desc "Optimize PNG files with optipng"
task :optipng do
	if dir = compassConfig('images_dir') then
		path = File.expand_path(dir, File.join(CONFIG['root'], CONFIG['compass_project']))
		system("find '#{path}' -type f -name '*.png' | xargs optipng -quiet -preserve")
	end
end

def jekyllEnvironment(mode = 'development')
	path = File.join(CONFIG['root'], "_config.yml")
	text = File.read(path)
	f = File.open(path, "w")
	f.write(text.sub(/^([ \t#]*environment[\t ]*:[ \t]*)\w+[ \t]*$/mi, '\1' + mode));
	f.close()
end

namespace :jekyll do
	
	desc "Clean generated site"
	task :clean do
		path = Jekyll.configuration({})['destination']
		if (File.expand_path(CONFIG['root']) != path && File.directory?(path)) then
			puts "Removing #{path}"
			FileUtils.rm_rf(path)
		end
	end

	desc "Change the jekyll 'environment' config parameter to 'development'"
	task :development do
		jekyllEnvironment('development')
	end

	desc "Change the jekyll 'environment' config parameter to 'production'"
	task :production do
		jekyllEnvironment('production')
	end

	desc "Run jekyll"
	task :run do
		@site = Jekyll::Site.new(Jekyll.configuration({}))
		@site.process
	end

	desc "Start web server and watch for changes"
	task :server do
		system("open 'http://#{`echo "$HOSTNAME"`.chomp}:" + Jekyll.configuration({})['server_port'].to_s + "'")
		exec "jekyll", "--server", "--auto"
	end
	
end

def compassConfig(param)
	Compass.configuration_for(File.join(CONFIG['root'], CONFIG['compass_project'], 'config.rb')).instance_variable_get('@' + param)
end

namespace :compass do
	
	desc "Remove generated files and the sass cache"
	task :clean do
		system("cd '" + File.join(CONFIG['root'], CONFIG['compass_project']) + "' &>/dev/null && compass clean")
	end
	
	desc "Compass compile with `-e development`"
	task :development do
		system("cd '" + File.join(CONFIG['root'], CONFIG['compass_project']) + "' &>/dev/null && compass compile -e development")
	end

	desc "Compass compile with `-e production --force`"	
	task :production do
		system("cd '" + File.join(CONFIG['root'], CONFIG['compass_project']) + "' &>/dev/null && compass compile -e production --force")
	end
	
	desc "Watch the compass project for changes and recompile when they occur"
	task :watch do
		Dir.chdir(File.join(CONFIG['root'], CONFIG['compass_project']))
		exec "compass", "watch", "--environment", "development"
	end
	
end
