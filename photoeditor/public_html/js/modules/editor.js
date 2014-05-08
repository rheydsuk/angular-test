var editor = angular.module('editor', []);
//  page models
editor.factory('pages',function(){
    var pages   = [
        {title:'First page',photo:'images/1.png',settings:false},
        {title:'Second page',photo:'images/2.jpg',settings:false},
        {title:'Third page',photo:'images/2.jpg',settings:false},
        {title:'Third page',photo:'images/1.png',settings:false},
        {title:'Third page',photo:'images/2.jpg',settings:false},
        {title:'Third page',photo:'images/1.png',settings:false},
        {title:'Third page',photo:'images/2.jpg',settings:false},
        {title:'Third page',photo:'images/2.jpg',settings:false},
        {title:'Third page',photo:'images/1.png',settings:false},
        {title:'Third page',photo:'images/2.jpg',settings:false},
        {title:'Third page',photo:'images/2.jpg',settings:false},
        {title:'Third page',photo:'images/2.jpg',settings:false},
        {title:'Third page',photo:'images/2.jpg',settings:false},
        {title:'Third page',photo:'images/2.jpg',settings:false},
        {title:'Third page',photo:'images/2.jpg',settings:false},
        {title:'Third page',photo:'images/2.jpg',settings:false},
        {title:'Third page',photo:'images/2.jpg',settings:false},
        {title:'Third page',photo:'images/2.jpg',settings:false},
        {title:'Third page',photo:'images/2.jpg',settings:false},
        {title:'Third page',photo:'images/2.jpg',settings:false},
        {title:'Third page',photo:'images/2.jpg',settings:false}
    ];
    return pages;
});
// drag image
editor.directive('imagedrag',function(){
    return {
        restrict:'A',
        link:function(scope,element,attrs){
            var el          =   element;
            el.draggable    =   true;
            //  drag start handle
            el.bind('dragstart',function(e) {
                e.originalEvent.dataTransfer.effectAllowed = 'move';
                e.originalEvent.dataTransfer.setData('id', this.id);
                this.classList.add('drag-start');
            });
            //  drag end handle
            el.bind('dragend',function(e){
                this.classList.remove('drag-start');
            });
        }
    }
});
//  drop internal image
editor.directive('imagedrop',function(){
    return {
        restrict:'A',
        link:function(scope,element,attrs){
            var el  =   element;
            //  handle drag over
            el.bind('dragover',function(e){
                e.stopPropagation();
                e.preventDefault();
                this.classList.add('drag-over');
            });
            // handle drag out
            el.bind('dragleave',function(e){
                this.classList.remove('drag-over');
            });
            // handle drop item
            el.bind('drop',function(e){
                e.stopPropagation();
                e.preventDefault();
                var source    = e.originalEvent.dataTransfer.getData('id');
                this.classList.remove('drag-over');
                if(!source){
                    var reader      =   new FileReader();
                    reader.onload   =   function(e){
                        console.log(e.target.result);
                    }
                    reader.readAsDataURL(e.originalEvent.dataTransfer.files[0]);
                }else{
                    var dest    =   this.id;
                    scope.$apply(function(){
                        scope.arrange(source,dest);
                    });
                }
            });
        }
    }
});
// drop external image
editor.directive('dropexternalimage',function(){
    return {
        restrict:'A',
        link:function(scope,element,attrs){
            var el  =   element;
            //  handle drag over
            el.bind('dragover',function(e){
                e.stopPropagation();
                e.preventDefault();
            });
            // handle drop item
            el.bind('drop',function(e){
                e.stopPropagation();
                e.preventDefault();
                var source    = e.originalEvent.dataTransfer.getData('id');
                if(!source){
                    var reader      =   new FileReader();
                    reader.onload   =   function(e){
                        var image   =   e.target.result;
                        scope.$apply(function(){
                            scope.addPage('photo',image);
                        });
                    }
                    reader.readAsDataURL(e.originalEvent.dataTransfer.files[0]);
                }
            });
        }
    }
});
//  photo container
editor.directive('photopreview',function(){
    return {
        restrict    :   'A',
        link:function(scope,element,attrs){
            var el      =   element;
            //  auto resize editor
            var width   =   el.width();
            var height  =   (width/11)*8;
            el.css({
                height          :   height+'px',
                backgroundColor :   '#f3f3f3'
            });
            //  initialise editor
            var id  =   el.attr('id');
            if(!scope.stage[id]){
                scope.stage[id] =   new Kinetic.Stage({
                    container   : id,
                    width       : width,
                    height      : height
                });
            }
        }
    }
});
//  loading page list
editor.controller('PageListingController',['$scope','pages',function(scope,pages){
    //  format pages
    var formatPages     =   function(pages){
        var formattedPages  =   [];
        var key             =   0;
        pages.forEach(function(entry,id){
            if(id%2==0){
                formattedPages[key]    =   {};
                formattedPages[key]['left']   =   entry;
            }else{
                formattedPages[key]['right']   =   entry;
                key++;
            }
        });
        return formattedPages;
    }
    scope.activePage        =   0;                  //  active page
    scope.pages             =   formatPages(pages); //  formatted pages
    scope.viewClass         =   'listview-default'; //  class for view type
    scope.viewArrow         =   'down';             //  class to add in glypicon
    scope.addPhotoHandle    =   'hide';             //  toggle add page from external image
    scope.stage             =   {};                 //  current stage
    //  arrange page
    scope.arrange       =   function(source,dest){
        var sourcePage  =   pages[source];
        var destPage    =   pages[dest];
        pages[dest]     =   sourcePage;
        pages[source]   =   destPage;
        scope.pages     =   formatPages(pages);
        scope.loadPage();
    }    
    scope.addPage       =   function(field,value){
        var newPage     =   {
            title       :   'New Page',
            settings    :   false
        };
        newPage[field]  =   value;
        pages.splice(0,0,newPage);
        scope.pages     =   formatPages(pages);
        scope.loadPage();
    }
    //  add photo page handle
    scope.showAddPhotoPage      =   function(){
        scope.addPhotoHandle    =   '';
    }
    scope.hideAddPhotoPage      =   function(){
        scope.addPhotoHandle    =   'hide';
    }
    //  switch view toogle
    scope.switchList    =   function(){
        if(scope.viewArrow=='up'){
            scope.viewArrow     =   'down';
            scope.viewClass     =   'listview-default';
        }else{
            scope.viewArrow     =   'up';
            scope.viewClass     =   'listview-all';
        }
    }
    //  select page
    scope.changePage    =   function(page){
        scope.activePage    =   page;
        scope.viewArrow     =   'down';
        scope.viewClass     =   'listview-default';
        scope.loadPage();
    }
    //  load book page
    var loadPage           =   function(id){
        if(typeof(scope.stage[id])!='undefined'){
            scope.stage[id].clear();
        }
        var currentPage     =   scope.pages[scope.activePage][id];
        var imageObj        =   new Image();   
        imageObj.src        =   currentPage.photo;
        imageObj.onload     =   function(){
            scope.pages[scope.activePage][id]['imageObject']  =   imageObj;
            var settings    =   {
                image       :   imageObj,
                draggable   :   true
            }
            if(currentPage.settings==false){
                currentPage.settings    =   scope.fitPage(imageObj,id,'x');
            }
            settings        =   $.extend(settings,currentPage.settings);
            var layer       =   new Kinetic.Layer();
            var userPhoto   =   new Kinetic.Image(settings);
            scope.pages[scope.activePage][id]['stagePhoto'] =   userPhoto;
            layer.add(userPhoto);
            scope.stage[id].add(layer);
            //  load photo settings
            if(!currentPage.stagePhotoSettings){
                scope.pages[scope.activePage][id].stagePhotoSettings    =   {
                    zoom    :   0,
                    rotate  :   0,
                    flip    :   {
                        x   :   1,
                        y   :   1
                    }
                };
            }else{
                
            }
        }
    }
    scope.loadPage          =   function(){
        var currentFlip =   scope.pages[scope.activePage];
        if(currentFlip.left){
            loadPage('left');
        }
        if(currentFlip.right){
            loadPage('right');
        }
    }
    //  fit to page
    scope.fitPage           =   function(imageObj,id,direction){
        var maxWidth            =   scope.stage[id].width();
        var maxHeight           =   scope.stage[id].height();
        var height              =   imageObj.height;
        var width               =   imageObj.width;
        var x                   =   0;
        var y                   =   0;
        var resizePercent       =   0;
        if(direction=='x'){
            resizePercent       =   maxWidth/width;
            width               =   maxWidth;
            height              =   height*resizePercent;
        }
        if(direction=='y'){
            resizePercent       =   maxHeight/height;
            height              =   maxHeight;
            width               =   width*resizePercent;
        }
        x                       =   (maxWidth-width)/2;
        y                       =   (maxHeight-height)/2;
        resizePercent           =   (resizePercent*100);
        var settings            =   {
            x                   :   x,
            y                   :   y,
            height              :   height,
            width               :   width,
            defaultPercent      :   resizePercent,
            fitDirection        :   direction
        };
        //  save settings
        scope.pages[scope.activePage][id].settings   =   settings;
        return  settings;
    }
    //  custom zoom
    scope.manualZoom    =   function(id,zoom){
        var settings    =   scope.pages[scope.activePage][id].settings;
        scope.stage[id].clear();
        scope.pages[scope.activePage][id].stagePhotoSettings.zoom   =   zoom;
        var newWidth    =   settings.width+(settings.width*(zoom/100));
        var newHeight   =   settings.height+(settings.height*(zoom/100));
        scope.pages[scope.activePage][id].stagePhoto.setSize({
            width   :  newWidth,
            height  :  newHeight
        });
        scope.pages[scope.activePage][id].stagePhoto.draw();
    }
}]);
//  loading page editor
editor.controller('PageEditorController',['$scope',function(scope){
        scope.loadPage();
        //  fit to page
        scope.doFitPage     =   function(id,direction){
            var imageObj    =   scope.pages[scope.activePage][id].imageObject;
            scope.pages[scope.activePage][id].settings  =   scope.fitPage(imageObj,id,direction);
            scope.loadPage();
        }
        //  auto fit to page
        scope.autoFitPage   =   function(id){
            var fitDirection    =   scope.pages[scope.activePage][id].settings.fitDirection;
            if(fitDirection=='x'){
               scope.doFitPage(id,'y');
            }else{
               scope.doFitPage(id,'x');
            }
        }
        //  zoom in
        scope.zoomIn        =   function(id){
            var zoom        =   scope.pages[scope.activePage][id].stagePhotoSettings.zoom;
            if(zoom%10!=0){
                zoom     =   zoom-(zoom%10);
            }
            zoom =   parseInt(zoom);
            if(zoom<=800){
                zoom    +=  10;
                scope.manualZoom(id,zoom);
            }
        }
        //  zoom out
        scope.zoomOut       =   function(id){
            var zoom        =   scope.pages[scope.activePage][id].stagePhotoSettings.zoom;
            if(zoom%10!=0){
                zoom     =   zoom-(zoom%10);
            }
            zoom =   parseInt(zoom);
            if(zoom>-50){
                zoom    -=  10;
                scope.manualZoom(id,zoom);
            }
        }
        //  rotate  right
        scope.rotate        =   function(id,direction){
            var photo       =   scope.pages[scope.activePage][id].stagePhoto;
            scope.stage[id].clear();
            scope.pages[scope.activePage][id].stagePhoto.offset({
                x   :   photo.getWidth()/2,
                y   :   photo.getHeight()/2
            });
            scope.pages[scope.activePage][id].stagePhoto.position({
                x   :   photo.getWidth()/2,
                y   :   photo.getHeight()/2
            });
            var rotate  =   0;
            if(direction==='left'){
                rotate  =   -30;
                scope.pages[scope.activePage][id].stagePhotoSettings.rotate -=  30;
            }else{
                rotate  =   30;
                scope.pages[scope.activePage][id].stagePhotoSettings.rotate +=  30;
            }
            scope.pages[scope.activePage][id].stagePhoto.rotateDeg(rotate);
            scope.pages[scope.activePage][id].stagePhoto.draw();
        }
        //  flip horizontal
        scope.flip          =   function(id,direction){
            scope.stage[id].clear();
            var photo       =   scope.pages[scope.activePage][id].stagePhoto;
            console.log(photo.offset());
            if(direction=='horizontal'){
                if(photo.offsetX()==0){
                    photo.offsetX(photo.getWidth());
                }else if(photo.offsetX()==photo.getWidth()){
                    photo.offsetX(0);
                }
                scope.pages[scope.activePage][id].stagePhoto.scale({
                    x   :   (photo.scaleX()===1)?-1:1
                });
                scope.pages[scope.activePage][id].stagePhotoSettings.flip.x =   photo.scaleX();
            }else{
                if(photo.offsetY()==0){
                    photo.offsetY(photo.getHeight());
                }else if(photo.offsetY()==photo.getHeight()){
                    photo.offsetY(0);
                }
                scope.pages[scope.activePage][id].stagePhoto.scale({
                    y   :   (photo.scaleY()===1)?-1:1
                });
                scope.pages[scope.activePage][id].stagePhotoSettings.flip.y =   photo.scaleY();
            }
            scope.pages[scope.activePage][id].stagePhoto.draw();
        }
}]);