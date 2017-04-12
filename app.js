/**
 * Created by ht on 2017/4/11.
 */

let store = {
    setStore(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    fetchStore(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }
};

// let items = [];
let items = store.fetchStore('laputa');

// 利用hash过滤，有三种情况,all undone, done
let filterTodo = {
    all(list) {
        return list;
    },
    undone(list) {
        return list.filter(function (item) {
            return !item.changeCheck
        })
    },
    done(list) {
        return list.filter(function (item) {
            return item.changeCheck
        })
    }
};


let vm = new Vue({
    el: '.main',
    data: {
        lists: items,
        changeCheck: '',
        addTodoText: '',
        editorTodo: '', //保存编辑的值
        beforeTitle: '',
        filterHash: 'all' //筛选的属性
    },
    watch: {
        lists: { //监控lists这个属性，当这个属性对应的值发生变化就会执行函数
            handler() {
                store.setStore('laputa', this.lists);
            },
            deep: true
        }
    },
    directives: {
        "focus": {
            update(el, binding) {
                if (binding.value) {
                    el.focus();
                }
            }
        }
    },
    methods: {
        addTodo() {
            this.lists.push({
                text: this.addTodoText,
                changeCheck: this.changeCheck
            });
            this.addTodoText = '';
        },
        delTodo(item) { //删除任务
            this.lists.splice(this.lists.indexOf(item), 1);
        },
        editTodo(item) {    //编辑任务
            this.editorTodo = item;
            // 编辑任务的时候，记录一下编辑这条任务的text，方便在取消编辑的时候重新给之前的text
            this.beforeTitle = item.text;

        },
        enterTodo(item) {   //编辑任务成功
            this.lists[this.lists.indexOf(item)].text = item.text;
            this.editorTodo = '';
        },
        cancelEdit(item) {  // 取消编辑
            this.lists[this.lists.indexOf(item)].text = this.beforeTitle;
            this.editorTodo = '';

        }
    },
    computed: {
        counter() {
            return this.lists.filter(function (item) {
                return !item.changeCheck
            }).length;
        },
        filterList() {
           return filterTodo[this.filterHash] ? filterTodo[this.filterHash](this.lists) : this.lists;
        }
    }
});

function watchHashChange() {
    let hash = window.location.hash.slice(1);
    vm.filterHash = hash;
}

watchHashChange();

window.addEventListener('hashchange', watchHashChange);


