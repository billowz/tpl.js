tpl.init();

tpl.ready(function() {
    var todo = {
        edited: null,
        todos: [],
        displayTodos: [],
        completedNum: 0,
        title: 'Todo MVC',
        visibility: 'all',
        filters: {
            all: function(todos) {
                return todos;
            },
            active: function(todos) {
                return tpl.filter(todos, function(todo) {
                    return !todo.completed;
                });
            },
            completed: function(todos) {
                return tpl.filter(todos, function(todo) {
                    return todo.completed;
                });
            }
        },
        add: function(scope, el) {
            this.todos = this.todos.concat({
                title: tpl.val(el),
                completed: false
            });
            tpl.val(el, '');
            tpl.focus(el);
            this.displayTodos = this.filters[this.visibility](this.todos)
        },
        edit: function(todo) {
            this.edited = todo
        },
        update: function(todo, el) {
            if (!todo.title) {
                this.remove(todo);
            }
            this.edited = undefined
        },
        remove: function(todo) {
            var idx = tpl.indexOf(this.todos, todo);
            this.todos.splice(idx, 1);
            if (todo.completed)
                this.completedNum--;
            this.displayTodos = this.filters[this.visibility](this.todos)
        },
        toggleAll: function() {
            var done = this.completedNum != this.todos.length;
            tpl.each(this.todos, function(todo) {
                tpl.proxy(todo).completed = done;
            })
            this.completedNum = done ? this.todos.length : 0;
            console.log(this)
        },
        toggle: function(todo) {
            todo.completed = !todo.completed;
            if (todo.completed) {
                this.completedNum++;
            } else {
                this.completedNum--;
            }
            this.displayTodos = this.filters[this.visibility](this.todos)
        },
        clear: function() {
            tpl.each(this.todos, function(todo) {
                tpl.proxy(todo).completed = false;
            })
            this.completedNum = 0;
            this.displayTodos = this.filters[this.visibility](this.todos)
        },
        vis: function(type) {
            if (this.visibility !== type) {
                this.visibility = type
                this.displayTodos = this.filters[this.visibility](this.todos)
            }
        }
    }

    var todoTpl = new tpl(document.getElementById('tpl/todo.html').innerHTML)
        .complie(todo).appendTo('.todoapp')
})
