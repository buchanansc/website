require "rake"
require "yaml"

CONFIG = {
	'root' => File.dirname(__FILE__),
	'compass_project' => '',
	'jekyll_config' => '_config.yml',
}

task :default do
	exec("rake --rakefile '#{__FILE__}' --tasks")
end

def jekyllConfigProduction(on = true)
	path = File.join(CONFIG['root'], CONFIG['jekyll_config'])
	text = File.read(path)
	f = File.open(path, "w")
	f.write(text.sub(/^[ #]*production *: *true\s*$/mi, "#{(!on)? '# ' : ''}production: true\n"));
	f.close()
end

desc 'Switch to the development environment'
task :development => ["compass:clean", "compass:development", "jekyll:clean"] do
	jekyllConfigProduction(false)
	Rake::Task["jekyll:server"].execute
end

desc 'Switch to the production environment'
task :production => ["compass:clean", "compass:production", "compass:cache", "jekyll:clean"] do
	jekyllConfigProduction(true)
	Rake::Task["jekyll:run"].execute
end

desc 'Clean all cache and generated files'
task :clean => ["compass:clean", "compass:cache", "jekyll:clean"]



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
		port = yml['server_port'] || 4000
		system("{ sleep 1 && open 'http://#{`echo "$HOSTNAME"`.chomp}:#{port}'; } &>/dev/null &")
		system("cd '#{CONFIG['root']}' && jekyll --server --auto")
	end

	desc 'Run jekyll'
	task :run do
		system("cd '#{CONFIG['root']}' && jekyll")
	end

end

namespace :compass do

	desc 'Remove sass cache'
	task :cache do
		system("find '#{CONFIG['root']}' -type d -name '.sass-cache' -prune -exec echo \"Removing {}\" \\; -exec rm -r \\{\\} \\;")
	end

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
