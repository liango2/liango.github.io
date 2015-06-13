(function ($) {
    var Album = function (poster) {
        var self = this;

        //alert(poster.attr("data-setting"));

        this.poster = poster;
        this.posterItemMain = poster.find("ul.poster-list");
        this.nextBtn = poster.find("div.poster-next-btn");
        this.prevBtn = poster.find("div.poster-prev-btn");
        this.posterItems = poster.find("li.poster-item");
        this.posterFirstItem = this.posterItems.first();
        this.posterLastItem = this.posterItems.last();
        this.rotateFlag = true;

        // 默认参数
        this.setting = {
            width: 1000, // 幻灯片的宽度
            height: 270, // 幻灯片的高度
            posterWidth: 640, // 幻灯片第一帧的宽度
            posterHeight: 270, // 幻灯片第一帧的高度
            scale: 0.9, // 按照90%缩小图片宽高
            speed: 500, // 轮播速度 500毫秒
            "autoPlay": true, // 自动播放
            "delay": 800, // 自动播放延迟时间
            verticalAlign: "middle"
        };
        //console.log(this.setting);
        //console.log(this.getSetting())
        $.extend(this.setting, this.getSetting());

        //设置配置参数
        this.setSettingValue();
        this.setPosterPos();

        // 开始转
        this.nextBtn.click(function () {
            if(self.rotateFlag){
                self.rotateFlag = false;
                self.rotate("left");
            }
        });

        this.prevBtn.click(function () {
            if(self.rotateFlag) {
                self.rotateFlag = false;
                self.rotate("right");
            }
        });


        if(this.setting.autoPlay){
            this.autoPlay();
            this.poster.hover(function(){
                window.clearInterval(self.timer);
            }, function(){
                self.autoPlay();
            });
        }
    };

    Album.prototype = {
        autoPlay: function () {
            var self = this;
            this.timer = window.setInterval(function(){
                self.nextBtn.click();
            }, this.setting.delay)
        },

        // 旋转
        rotate: function (dir) {
            var _this_ = this;
            var zIndexArr = [];

            if (dir === "left") { // 向左转
                this.posterItems.each(function () {
                        var self = $(this),
                            prev = self.prev().get(0) ? self.prev() : _this_.posterLastItem,
                            width = prev.width(),
                            height = prev.height(),
                            zIndex = prev.css("zIndex"),
                            opacity = prev.css("opacity"),
                            left = prev.css("left"),
                            top = prev.css("top");

                        zIndexArr.push(zIndex);

                        self.animate({
                            width: width, height: height,
                            // zIndex: zIndex,
                            opacity: opacity, left: left, top: top
                        }, _this_.setting.speed, function () {
                           _this_.rotateFlag = true;
                        });

                    }
                );

                this.posterItems.each(function (i) {
                    $(this).css("zIndex", zIndexArr[i])
                });
            }
            else if (dir === "right") { // 向右转
                this.posterItems.each(function () {
                        var self = $(this),
                            next = self.next().get(0) ? self.next() : _this_.posterFirstItem,
                            width = next.width(),
                            height = next.height(),
                            zIndex = next.css("zIndex"),
                            opacity = next.css("opacity"),
                            left = next.css("left"),
                            top = next.css("top");

                        zIndexArr.push(zIndex);

                        self.animate({
                            width: width, height: height,
                            // zIndex: zIndex,
                            opacity: opacity, left: left, top: top
                        },_this_.setting.speed,  function () {
                           _this_.rotateFlag = true;
                        });
                    }
                );

                this.posterItems.each(function (i) {
                    $(this).css("zIndex", zIndexArr[i])
                });
            }
        }
        ,

        // 设置剩余的图片的位置关系
        setPosterPos: function () {
            var self = this;
            var sliceItems = this.posterItems.slice(1),
                sliceSize = sliceItems.size() / 2,
                rightSlice = sliceItems.slice(0, sliceSize), // 得到右边的图片
                level = Math.floor(this.posterItems.size() / 2),
                leftSlice = sliceItems.slice(sliceSize); // 得到左边的图片

            // 右侧
            var rw = this.setting.posterWidth,
                rh = this.setting.posterHeight,
                gap = (this.setting.width - this.setting.posterWidth) / 2 / level;

            var firstLeft = (this.setting.width - this.setting.posterWidth) / 2;
            var fixOffsetLeft = firstLeft + rw;

            rightSlice.each(function (i) {
                level--;
                rw = rw * self.setting.scale;
                rh = rh * self.setting.scale;

                var j = i;

                $(this).css({
                        zIndex: i,
                        width: rw,
                        height: rh,
                        opacity: 1 / (++i),
                        left: fixOffsetLeft + (++j) * gap - rw,
                        //top: (self.setting.height - rh) / 2
                        top: self.setVerticalAlign(rh)
                    }
                )
            });

            // 左侧
            var lw = rightSlice.last().width(),
                lh = rightSlice.last().height(),
                level2 = Math.floor(this.posterItems.size() / 2);

            leftSlice.each(function (i) {
                $(this).css({
                        zIndex: level,
                        width: lw,
                        height: lh,
                        opacity: 1 / level2,
                        left: i * gap,
                        //top: (self.setting.height - lh) / 2
                        top: self.setVerticalAlign(lh)
                    }
                );

                lw = lw / self.setting.scale;
                lh = lh / self.setting.scale;

                level2--;
            });

        }
        ,

        //设置垂直对齐方式
        setVerticalAlign: function (height) {
            var verticalAlignType = this.setting.verticalAlign,
                top = 0;

            if (verticalAlignType === "middle") {
                top = (this.setting.height - height ) / 2;
            } else if (verticalAlignType === "top") {
                top = 0;
            } else if (verticalAlignType === "botton") {
                top = this.setting.height - height;
            } else {
                top = (this.setting.height - height ) / 2;
            }
            return top;
        }
        ,

        //设置配置参数
        setSettingValue: function () {
            this.poster.css({
                width: this.setting.width,
                height: this.setting.height
            });
            this.posterItemMain.css({
                width: this.setting.width,
                height: this.setting.height
            });

            //计算按钮的宽度
            var w = (this.setting.width - this.setting.posterWidth) / 2;
            this.nextBtn.css({
                width: w,
                height: this.setting.height,
                zIndex: Math.ceil(this.posterItems.size() / 2)
            });
            this.prevBtn.css({
                width: w,
                height: this.setting.height,
                zIndex: Math.ceil(this.posterItems.size() / 2)
            });

            //指定第一帧的位置
            this.posterFirstItem.css({
                width: this.setting.posterWidth,
                height: this.setting.posterHeight,
                left: w,
                zIndex: Math.floor(this.posterItems.size() / 2)
            });

            // 第一帧右边的

            // 设置层级关系
        }
        ,

        //获取客户参数
        getSetting: function () {
            var setting = this.poster.attr("data-setting");
            if (setting && setting != "") {
                return $.parseJSON(setting);
            } else {
                return {};
            }
        }
    };

    Album.init = function (posters) {
        var _this_ = this;
        posters.each(function () {
            new _this_($(this)); // each中默认为dom对象,转成jquery对象
        });
    };
    window["Album"] = Album; // 将闭包中的Album共享到windows全局变量下面
})(jQuery); // 引入jquery