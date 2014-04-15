var editor = angular.module('editor', []);
//  page models
editor.factory('pages',function(){
    var pages   = [
        {title:'First page',photo:'http://chunky.llbit.se/images/a/a7/Sample.png'},
        {title:'Second page',photo:'http://www.eminenstore.com/wp-content/uploads/2012/04/samples.jpg'},
        {title:'Third page',photo:'http://www.eminenstore.com/wp-content/uploads/2012/04/samples.jpg'},
        {title:'Third page',photo:'http://www.eminenstore.com/wp-content/uploads/2012/04/samples.jpg'},
        {title:'Third page',photo:'http://www.eminenstore.com/wp-content/uploads/2012/04/samples.jpg'},
        {title:'Third page',photo:'http://www.eminenstore.com/wp-content/uploads/2012/04/samples.jpg'},
        {title:'Third page',photo:'http://www.eminenstore.com/wp-content/uploads/2012/04/samples.jpg'},
        {title:'Third page',photo:'http://www.eminenstore.com/wp-content/uploads/2012/04/samples.jpg'},
        {title:'Third page',photo:'http://www.eminenstore.com/wp-content/uploads/2012/04/samples.jpg'},
        {title:'Third page',photo:'http://www.eminenstore.com/wp-content/uploads/2012/04/samples.jpg'},
        {title:'Third page',photo:'http://www.eminenstore.com/wp-content/uploads/2012/04/samples.jpg'}
    ];
    return pages;
})
//  loading page list
editor.controller('PageListingController',['$scope','pages',function(scope,pages){
    var formatPages =   [];
    var key         =   0;
    pages.forEach(function(entry,id){
        if(id%2==0){
            formatPages[key]    =   {};
            formatPages[key]['left']   =   entry;
        }else{
            formatPages[key]['right']   =   entry;
            key++;
        }
    });
    scope.pages        =   formatPages;
    //  drag photo
    scope.onDrag       =   function(){
        alert('hello world');
    }
}]);
// drag image
editor.directive('imagedrag',[function(){
    var handleDragStart     =   function(){
        this.style.opacity  =   0.5;
    }
    var handleDragEnd       =   function(){
        this.style.opacity  =   1;
    }
    return {
        restrict:'A',
        link:function(scope,jElm,attrs){
            jElm.attr("draggable","true");
            jElm.bind("dragstart",handleDragStart);
            jElm.bind("dragend",handleDragEnd);
        }
    }
}]);
//  drop image
editor.directive('imagedrop'[function(){
    var handleDragOver  =   function(){
        this.style.border  =   '1px solid red!important';
    }
     return{
        restrict:'A',
        link: function(scope,jElement,attrs){
            jElement.bind("dragover",handleDragOver);
        }
    }
}]);