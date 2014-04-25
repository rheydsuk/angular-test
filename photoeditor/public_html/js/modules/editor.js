var editor = angular.module('editor', []);
//  page models
editor.factory('pages',function(){
    var pages   = [
        {title:'First page',photo:'images/1.png'},
        {title:'Second page',photo:'images/2.jpg'},
        {title:'Third page',photo:'images/2.jpg'},
        {title:'Third page',photo:'images/2.jpg'},
        {title:'Third page',photo:'images/2.jpg'},
        {title:'Third page',photo:'images/2.jpg'},
        {title:'Third page',photo:'images/2.jpg'},
        {title:'Third page',photo:'images/2.jpg'},
        {title:'Third page',photo:'images/2.jpg'},
        {title:'Third page',photo:'images/2.jpg'},
        {title:'Third page',photo:'images/2.jpg'}
    ];
    return pages;
})
//  loading page list
editor.controller('PageListingController',['$scope','pages',function(scope,pages){
    //  format pages
    var formatPages     =   function(pages){
        var formattedPages  =   [];
        var key         =   0;
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
    scope.pages         =   formatPages(pages);
    //  arrange page
    scope.arrange   =   function(source,dest){
        var sourcePage  =   pages[source];
        var destPage    =   pages[dest];
        pages[dest]     =   sourcePage;
        pages[source]   =   destPage;
        scope.pages     =   formatPages(pages);
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
//  drop image
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