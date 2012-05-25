CONFIG = {
	'root' => File.dirname(__FILE__),
	'compass_project' => '',
	'jekyll_site' => '_site',
	'server_hostname' => `echo "$HOSTNAME"`.chomp,
	'server_port' => 4000
}

task :default do
	exec("rake --rakefile '#{__FILE__}' --tasks")
end

desc 'Switch to development environment'
task :development => ["compass:clean", "compass:development", "jekyll:preview"] do
end

desc 'Switch to production environment'
task :production => ["compass:clean", "compass:production", "compass:cache", "jekyll:clean"]

namespace :jekyll do

	desc 'Clear generated site'
	task :clean do
		path = File.expand_path(File.join(CONFIG['root'], CONFIG['jekyll_site']))
		if (File.expand_path(CONFIG['root']) != path && File.directory?(path)) then
			puts "Removing #{path}"
			FileUtils.rm_rf(path)
		end
	end

	desc 'Launch jekyll preview environment'
	task :preview do
		puts 'Launching jekyll server...'
		system("{ sleep 1 && open 'http://#{CONFIG['server_hostname']}:#{CONFIG['server_port']}'; } &>/dev/null &")
		system("cd '#{CONFIG['root']}' && jekyll --server #{CONFIG['server_port']} --auto")
	end

	desc 'Run jekyll'
	task :run do
		puts 'Running jekyll...'
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
