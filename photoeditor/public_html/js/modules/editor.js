var editor = angular.module('editor', []);
//  page models
editor.factory('pages',function(){
    var pages   = [
        {title:'First page',photo:'http://chunky.llbit.se/images/a/a7/Sample.png'},
        {title:'Second page',photo:'http://chunky.llbit.se/images/a/a7/Sample.png'},
        {title:'Third page',photo:'http://chunky.llbit.se/images/a/a7/Sample.png'},
        {title:'Third page',photo:'http://chunky.llbit.se/images/a/a7/Sample.png'},
        {title:'Third page',photo:'http://chunky.llbit.se/images/a/a7/Sample.png'},
        {title:'Third page',photo:'http://chunky.llbit.se/images/a/a7/Sample.png'},
        {title:'Third page',photo:'http://chunky.llbit.se/images/a/a7/Sample.png'},
        {title:'Third page',photo:'http://chunky.llbit.se/images/a/a7/Sample.png'},
        {title:'Third page',photo:'http://chunky.llbit.se/images/a/a7/Sample.png'},
        {title:'Third page',photo:'http://chunky.llbit.se/images/a/a7/Sample.png'},
        {title:'Fourth page',photo:'http://chunky.llbit.se/images/a/a7/Sample.png'}
    ];
    return pages;
})
//  loading page list
editor.controller('PageListingController',['$scope','pages',function($scope,pages){
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
    $scope.pages    =   formatPages;
}]);