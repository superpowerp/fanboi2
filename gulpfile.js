"use strict";

var gulp = require("gulp");
var concat = require("gulp-concat");
var es = require("event-stream");

var postcss = require("gulp-postcss");

var uglify = require("gulp-uglify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var browserify = require("browserify");
var tsify = require("tsify");

/* Settings
 * ----------------------------------------------------------------------------------- */

var paths = {
    /* Path for storing application-specific assets. */
    app: {
        assets: {
            base: "assets/app/assets",
            glob: "assets/app/assets/*",
            entries: [
                "assets/app/assets/icon.ico",
                "assets/app/assets/icon.png",
                "assets/app/assets/touch-icon.png",
            ],
        },
        stylesheets: {
            base: "assets/app/stylesheets",
            glob: "assets/app/stylesheets/**/*.css",
            entry: "assets/app/stylesheets/app.css",
        },
        javascripts: {
            base: "assets/app/javascripts",
            glob: "assets/app/javascripts/**/*.ts",
            entry: "assets/app/javascripts/app.ts",
        },
    },

    /* Path for storing third-party assets. */
    vendor: {
        assets: "assets/vendor/assets/*",
        stylesheets: "assets/vendor/stylesheets/**/*.css",
        javascripts: ["assets/vendor/javascripts/**/*.js"],
    },

    /* Path for storing compatibility assets. */
    legacy: {
        assets: "assets/legacy/assets/*",
        stylesheets: "assets/legacy/stylesheets/**/*.css",
        javascripts: "assets/legacy/javascripts/**/*.js",
    },

    /* Path to output compiled assets to. */
    dest: "fanboi2/static",
};

/* Helpers
 * ----------------------------------------------------------------------------------- */

function logError(error) {
    console.log(error);
    this.emit("end");
}

/* Assets
 * ----------------------------------------------------------------------------------- */

gulp.task("assets", function() {
    return es
        .merge([
            gulp.src(paths.app.assets.entries),
            gulp.src(paths.vendor.assets),
            gulp.src(paths.legacy.assets),
        ])
        .pipe(gulp.dest(paths.dest));
});

/* Stylesheets
 * ----------------------------------------------------------------------------------- */

var pc = require("postcss");
var spriteUpdateRule = require("postcss-sprites/lib/core").updateRule;

gulp.task("styles/app", ["assets"], function() {
    return gulp
        .src(paths.app.stylesheets.entry)
        .pipe(
            postcss([
                require("postcss-import"),
                require("postcss-mixins"),
                require("postcss-nested"),
                require("lost"),
                require("postcss-utilities")({ textHideMethod: "font" }),
                require("postcss-custom-media"),
                require("postcss-custom-properties")({ preserve: false }),
                require("postcss-color-function"),
                require("postcss-calc"),
                require("postcss-image-set-polyfill"),
                require("postcss-url")({
                    url: function(asset, dir, options, decl, warn, result) {
                        /* PostCSS-Sprites require absolute path to work with baseDir. */
                        if (asset.url.match(/^[^/]/)) {
                            return "/" + asset.url;
                        }
                    },
                }),
                require("postcss-sprites")({
                    stylesheetPath: paths.dest,
                    spritePath: paths.dest,
                    basePath: paths.app.assets.base,
                    retina: true,
                    spritesmith: { padding: 5 },
                    hooks: {
                        onUpdateRule: function(rule, token, image) {
                            spriteUpdateRule(rule, token, image);
                            rule.insertAfter(
                                rule.last,
                                pc.decl({
                                    prop: "background-repeat",
                                    value: "no-repeat",
                                }),
                            );
                            ["width", "height"].forEach(function(prop) {
                                var value = image.coords[prop];
                                if (image.retina) {
                                    value /= image.ratio;
                                }
                                rule.insertAfter(
                                    rule.last,
                                    pc.decl({
                                        prop: prop,
                                        value: value + "px",
                                    }),
                                );
                            });
                        },
                    },
                }),
                require("postcss-round-subpixels"),
                require("css-mqpacker"),
                require("postcss-urlrev")({
                    relativePath: paths.dest,
                    replacer: function(url, hash) {
                        /* Override to make it compatible with app. */
                        return url + "?h=" + hash.slice(0, 8);
                    },
                }),
                require("autoprefixer"),
                require("doiuse"),
                require("colorguard")({ allowEquivalentNotation: true }),
                require("postcss-discard-unused"),
                require("postcss-merge-idents"),
                require("postcss-reduce-idents"),
                require("postcss-zindex"),
                require("cssnano")({
                    preset: "default",
                }),
            ]).on("error", logError),
        )
        .pipe(gulp.dest(paths.dest));
});

gulp.task("styles/vendor", function() {
    return gulp
        .src(paths.vendor.stylesheets)
        .pipe(concat("vendor.css"))
        .pipe(postcss([require("cssnano")({ preset: "default" })]))
        .pipe(gulp.dest(paths.dest));
});

gulp.task("styles", ["styles/app", "styles/vendor"]);

/* JavaScripts
 * ----------------------------------------------------------------------------------- */

var externalDependencies = [
    "dom4",
    "domready",
    "js-cookie",
    "promise-polyfill",
    "virtual-dom",
];

gulp.task("javascripts/app", function() {
    return browserify({ debug: true })
        .plugin(tsify)
        .require(paths.app.javascripts.entry, { entry: true })
        .external(externalDependencies)
        .bundle()
        .on("error", logError)
        .pipe(source("app.js"))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(paths.dest));
});

gulp.task("javascripts/vendor", function() {
    return browserify({ debug: true })
        .require(externalDependencies)
        .bundle()
        .on("error", logError)
        .pipe(source("vendor.js"))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(paths.dest));
});

gulp.task("javascripts/legacy", function() {
    return gulp
        .src(paths.legacy.javascripts)
        .pipe(concat("legacy.js"))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dest));
});

gulp.task("javascripts", [
    "javascripts/app",
    "javascripts/vendor",
    "javascripts/legacy",
]);

/* Defaults
 * ----------------------------------------------------------------------------------- */

gulp.task("default", ["assets", "styles", "javascripts"]);

gulp.task("watch", ["default"], function() {
    gulp.watch(paths.app.stylesheets.glob, ["styles/app"]);
    gulp.watch(paths.vendor.stylesheets, ["styles/vendor"]);

    gulp.watch(paths.app.javascripts.glob, ["javascripts/app"]);
    gulp.watch(paths.vendor.javascripts, ["javascripts/vendor"]);
    gulp.watch(paths.legacy.javascripts, ["javascripts/legacy"]);
});
