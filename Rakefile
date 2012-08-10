require "rake"
require "yaml"

CONFIG = {
	'root' => File.dirname(__FILE__),
	'compass_project' => 'assets/_scss',
	'jekyll_config' => '_config.yml',
	'grunt_dir' => '',
	'images_dir' => 'assets/img',
}

task :default do
	exec("rake --rakefile '#{__FILE__}' --tasks")
end

desc 'Switch to the development environment'
task :development => ["clean", "compass:development", "jekyll:development", "jekyll:run"]

desc 'Switch to the production environment'
task :production => ["clean", "compass:production", "grunt", "optipng", "jekyll:production", "jekyll:run"]

desc 'Clean all cache and generated files'
task :clean => ["compass:clean", "jekyll:clean"]


task :grunt do
	system("cd '" + File.join(CONFIG['root'], CONFIG['grunt_dir']) + "' &>/dev/null && grunt")
end
task :optipng do
	system("find '" + File.join(CONFIG['root'], CONFIG['images_dir']) + "' -type f -name '*.png' | xargs optipng -quiet -preserve")
end

def jekyllEnvironment(mode = 'development')
	path = File.join(CONFIG['root'], CONFIG['jekyll_config'])
	text = File.read(path)
	f = File.open(path, "w")
	f.write(text.sub(/^([ \t#]*environment[\t ]*:[ \t]*)\w+[ \t]*$/mi, '\1' + mode));
	f.close()
end

def jekyllConfig(param)
	YAML.load_file(File.join(CONFIG['root'], CONFIG['jekyll_config']))[param]
end

namespace :jekyll do
	task :development do
		jekyllEnvironment('development')
	end
	task :production do
		jekyllEnvironment('production')
	end
	task :clean do
		path = File.expand_path(File.join(CONFIG['root'], jekyllConfig('destination') || '_site'))
		if (File.expand_path(CONFIG['root']) != path && File.directory?(path)) then
			puts "Removing #{path}"
			FileUtils.rm_rf(path)
		end
	end
	task :server do
		system("open 'http://#{`echo "$HOSTNAME"`.chomp}:" + (jekyllConfig('server_port') || '4000') + "'")
		system("cd '#{CONFIG['root']}' && jekyll --server --auto")
	end
	task :run do
		system("cd '#{CONFIG['root']}' && jekyll")
	end
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
		system("cd '" + File.join(CONFIG['root'], CONFIG['compass_project']) + "' &>/dev/null && compass watch -e development")
	end
end
