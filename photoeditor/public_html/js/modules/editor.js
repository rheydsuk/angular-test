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
    scope.pages             =   formatPages(pages); //  formatted pages
    scope.viewClass         =   'listview-default'; //  class for view type
    scope.viewArrow         =   'down';             //  class to add in glypicon
    scope.addPhotoHandle    =   'hide';             //  toggle add page from external image
    scope.activePage        =   scope.pages[0];
    //  arrange page
    scope.arrange       =   function(source,dest){
        var sourcePage  =   pages[source];
        var destPage    =   pages[dest];
        pages[dest]     =   sourcePage;
        pages[source]   =   destPage;
        scope.pages     =   formatPages(pages);
    }    
    scope.addPage       =   function(field,value){
        var newPage     =   {
            title       :   'New Page'
        };
        newPage[field]  =   value;
        pages.splice(0,0,newPage);
        scope.pages     =   formatPages(pages);
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
}]);
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
//  editor controller
editor.controller('EditorController',['$scope','pages',function(scope,pages){
        scope.editorStage   =   {};
         var fitToPage   =   function(imageObject,maxWidth,maxHeight,direction){
            var height              =   imageObject.height;
            var width               =   imageObject.width;
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
            return  {
                'x'                 :   x,
                'y'                 :   y,
                'height'            :   height,
                'width'             :   width,
                'defaultPercent'    :   resizePercent
            };
        }
        //  loading left page
        if(scope.activePage.left){
            var leftImageObj        =   new Image();   
            leftImageObj.src        =   scope.activePage.left.photo;
            leftImageObj.onload     =   function(){
                var settings        =   {
                    image       :   leftImageObj,
                    draggable   :   true
                }
                if(scope.activePage.left.settings==false){
                    settings    =   $.extend(settings,fitToPage(leftImageObj,scope.editorStage['leftpage'].width(),scope.editorStage['leftpage'].height(),'x'));
                }else{
                    settings    =   scope.activePage.left.settings;
                }
                var layer       =   new Kinetic.Layer();
                var userPhoto   =   new Kinetic.Image(settings);
                layer.add(userPhoto);
                scope.editorStage['leftpage'].add(layer);
            }
        }
        //  loading right page
        if(scope.activePage.right){
            var rightImageObj       =   new Image();   
            rightImageObj.src       =   scope.activePage.right.photo;
            rightImageObj.onload    =   function(){
                var layer           =   new Kinetic.Layer();
                var userPhoto       =   new Kinetic.Image({
                    image       :   rightImageObj,
                    width       :   100,
                    height      :   100,
                    draggable   :   true
                });
                layer.add(userPhoto);
                scope.editorStage['rightpage'].add(layer);
            }
        }
}]);
//  photo container
editor.directive('photopreview',function(){
    return {
        restrict    :   'A',
        link:function(scope,element,attrs){
            var el      =   element;
            //  auto resize editor
            var width   =   el.width();
            var height  =   (width/11)*8;
            el.css('height',height+'px');
            //  initialise editor
            var id  =   el.attr('id');
            scope.editorStage[id]   =   new Kinetic.Stage({
                container   : id,
                width       : width,
                height      : height
            });
        }
    }
});