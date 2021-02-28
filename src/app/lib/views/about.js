(function (App) {
    'use strict';
    const marked = require('marked');

    var About = Marionette.View.extend({
        template: '#about-tpl',
        className: 'about',

        ui: {
            success_alert: '.success_alert'
        },

        events: {
            'click .close-icon': 'closeAbout',
            'click #changelog': 'showChangelog'
        },

        onAttach: function () {
            $('.filter-bar').hide();
            $('#header').addClass('header-shadow');

            Mousetrap.bind(['esc', 'backspace'], function (e) {
                App.vent.trigger('about:close');
            });
            $('.links,#changelog').tooltip();
            win.info('Show about');
            $('#movie-detail').hide();
        },

        onBeforeDestroy: function () {
            Mousetrap.unbind(['esc', 'backspace']);
            $('.filter-bar').show();
            $('#header').removeClass('header-shadow');
            $('#movie-detail').show();
        },

        closeAbout: function () {
            if ($('.changelog-overlay').css('display') === 'block') {
                this.closeChangelog();
            } else {
                App.vent.trigger('about:close');
            }
        },

        showChangelog: function () {
            fs.readFile('./CHANGELOG.md', 'utf-8', function (err, contents) {
                if (!err) {
                    // render changelog html
                    let changelogText = $('.changelog-text');
                    changelogText.html(marked(contents));

                    // change all links that have href attribute to open in
                    // external app
                    let links = $('a[href]', changelogText);
                    links.each(function (i, el) {
                        el = $(el);
                        let url = el.attr('href');
                        el.attr('href', '');
                        el.click(function (event) {
                            nw.Shell.openExternal(url);
                            event.preventDefault();
                        });
                    });

                    $('.changelog-overlay').show();
                } else {
                    nw.Shell.openExternal(Settings.changelogUrl);
                }
            });
        },

        closeChangelog: function () {
            $('.changelog-overlay').hide();
        }

    });

    App.View.About = About;
})(window.App);
