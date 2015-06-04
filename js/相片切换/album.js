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

        // Ĭ�ϲ���
        this.setting = {
            width: 1000, // �õ�Ƭ�Ŀ��
            height: 270, // �õ�Ƭ�ĸ߶�
            posterWidth: 640, // �õ�Ƭ��һ֡�Ŀ��
            posterHeight: 270, // �õ�Ƭ��һ֡�ĸ߶�
            scale: 0.9, // ����90%��СͼƬ���
            speed: 500, // �ֲ��ٶ� 500����
            "autoPlay": true, // �Զ�����
            "delay": 800, // �Զ������ӳ�ʱ��
            verticalAlign: "middle"
        };
        //console.log(this.setting);
        //console.log(this.getSetting())
        $.extend(this.setting, this.getSetting());

        //�������ò���
        this.setSettingValue();
        this.setPosterPos();

        // ��ʼת
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

        // ��ת
        rotate: function (dir) {
            var _this_ = this;
            var zIndexArr = [];

            if (dir === "left") { // ����ת
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
            else if (dir === "right") { // ����ת
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

        // ����ʣ���ͼƬ��λ�ù�ϵ
        setPosterPos: function () {
            var self = this;
            var sliceItems = this.posterItems.slice(1),
                sliceSize = sliceItems.size() / 2,
                rightSlice = sliceItems.slice(0, sliceSize), // �õ��ұߵ�ͼƬ
                level = Math.floor(this.posterItems.size() / 2),
                leftSlice = sliceItems.slice(sliceSize); // �õ���ߵ�ͼƬ

            // �Ҳ�
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

            // ���
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

        //���ô�ֱ���뷽ʽ
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

        //�������ò���
        setSettingValue: function () {
            this.poster.css({
                width: this.setting.width,
                height: this.setting.height
            });
            this.posterItemMain.css({
                width: this.setting.width,
                height: this.setting.height
            });

            //���㰴ť�Ŀ��
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

            //ָ����һ֡��λ��
            this.posterFirstItem.css({
                width: this.setting.posterWidth,
                height: this.setting.posterHeight,
                left: w,
                zIndex: Math.floor(this.posterItems.size() / 2)
            });

            // ��һ֡�ұߵ�

            // ���ò㼶��ϵ
        }
        ,

        //��ȡ�ͻ�����
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
            new _this_($(this)); // each��Ĭ��Ϊdom����,ת��jquery����
        });
    };
    window["Album"] = Album; // ���հ��е�Album����windowsȫ�ֱ�������
})(jQuery); // ����jquery