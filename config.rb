project_type      = :stand_alone

http_path         = "/"

css_dir           = "resources/css"
sass_dir          = "resources/_scss"
images_dir        = "resources/images"
javascripts_dir   = "lib"

relative_assets = true

output_style = (environment == :production) ? :compressed : :expanded

