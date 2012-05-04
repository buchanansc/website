ROOT = File.dirname(__FILE__)
CONFIG = {
	'path_root' => ROOT,
	'path_scss' => ROOT,
	'server_hostname' => `echo "$HOSTNAME"`.chomp,
	'server_port' => 4000
}

task :default do
	exec("rake -f #{__FILE__} -T")
end

desc "Compile site"
task :compile => ["compass:development", "jekyll"] do
end

desc "Compile site for a production environment"
task :production => ["compass:production", "jekyll"] do
end

desc "Launch jekyll preview environment"
task :preview do
	system("{ sleep 1 && open 'http://#{CONFIG['server_hostname']}:#{CONFIG['server_port']}'; } &>/dev/null &")
	system("jekyll --server #{CONFIG['server_port']} --auto")
end

desc "Run jekyll"
task :jekyll do
	system("cd '#{CONFIG['path_root']}' && jekyll")
end

namespace :compass do
	task :development do
		system("cd '#{CONFIG['path_scss']}' &>/dev/null && compass compile --time -e development")
	end
	task :production do
		system("cd '#{CONFIG['path_scss']}' &>/dev/null && compass compile --time -e production --force")
	end
	task :clear_cache do
		puts "clearing compass cache..."
		system('find "' + CONFIG["path_root"] + '" -type d -name ".sass-cache" -prune -exec rm -r \{\} \;')
	end
end
