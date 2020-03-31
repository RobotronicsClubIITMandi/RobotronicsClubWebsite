var json = {
    "notifications" : 
    [
        {
            "title" : "dogi",
            "content" : "this is the first content"
        },
        {
            "title" : "billi",
            "content" : "this is the second content"
        }
    ]
}

var items = json.notifications;
var news = document.getElementById('news_ki_list');
for (var index = 0; index < items.length; index++) {
    var li = document.createElement('li');
    li.innerHTML = '<a data-toggle="collapse" class="collapse" href="#accordion-list-' +(index+1)+'"><span>' + (index+1)+'</span> '+items[index].title +' <i class="bx bx-chevron-down icon-show"></i><i class="bx bx-chevron-up icon-close"></i></a>    <div id="accordion-list-'+(index+1) +'" class="collapse show" data-parent=".accordion-list">  <p>' + items[index].content +'</p></div>';
    news.appendChild(li);
}