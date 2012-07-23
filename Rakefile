require "rake"
require "yaml"

CONFIG = {
	'root' => File.dirname(__FILE__),
	'compass_project' => '',
	'jekyll_config' => '_config.yml',
	'images_dir' => 'assets/img',
}

task :default do
	exec("rake --rakefile '#{__FILE__}' --tasks")
end

def jekyllEnvironment(mode = 'development')
	path = File.join(CONFIG['root'], CONFIG['jekyll_config'])
	text = File.read(path)
	f = File.open(path, "w")
	f.write(text.sub(/^([ \t#]*environment[\t ]*:[ \t]*)\w+[ \t]*$/mi, '\1' + mode));
	f.close()
end

desc 'Switch to the development environment'
task :development => ["clean", "compass:development"] do
	jekyllEnvironment('development')
	Rake::Task["jekyll:server"].execute
end

desc 'Switch to the production environment'
task :production => ["clean", "compass:production", "optipng"] do
	jekyllEnvironment('production')
	Rake::Task["jekyll:run"].execute
end

desc 'Clean all cache and generated files'
task :clean => ["compass:clean", "jekyll:clean"]

desc 'Optimize PNG files with optipng'
task :optipng do
	system("find '" + File.join(CONFIG['root'], CONFIG['images_dir']) + "' -type f -name '*.png' | xargs optipng")
end

namespace :jekyll do
	desc 'Clear generated site'
	task :clean do
		yml = YAML.load_file(File.join(CONFIG['root'], CONFIG['jekyll_config']))
		path = File.expand_path(File.join(CONFIG['root'], yml['destination'] || './_site'))
		if (File.expand_path(CONFIG['root']) != path && File.directory?(path)) then
			puts "Removing #{path}"
			FileUtils.rm_rf(path)
		end
	end
	desc 'Launch jekyll preview environment'
	task :server do
		yml = YAML.load_file(File.join(CONFIG['root'], CONFIG['jekyll_config']))
		system("{ sleep 1 && open 'http://#{`echo "$HOSTNAME"`.chomp}:#{yml['server_port'] || 4000}'; } &>/dev/null &")
		system("cd '#{CONFIG['root']}' && jekyll --server --auto")
	end
	desc 'Run jekyll'
	task :run do
		system("cd '#{CONFIG['root']}' && jekyll")
	end
end

namespace :compass do
	desc 'Remove generated files and the sass cache'
	task :clean do
		system("cd '" + File.join(CONFIG['root'], CONFIG['compass_project']) + "' &>/dev/null && compass clean")
	end
	desc 'Compass compile with `-e development`'
	task :development do
		system("cd '" + File.join(CONFIG['root'], CONFIG['compass_project']) + "' &>/dev/null && compass compile --time -e development")
	end
	desc 'Compass compile with `-e production --force`'
	task :production do
		system("cd '" + File.join(CONFIG['root'], CONFIG['compass_project']) + "' &>/dev/null && compass compile --time -e production --force")
	end
end
