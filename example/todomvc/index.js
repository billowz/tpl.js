tpl.init({
  lazy: false
});

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
      var val = tpl.trim(tpl.val(el));
      tpl.val(el, '');
      if (!val) return;
      /* this.todos.push({
         title: val,
         completed: false
       })*/
      this.todos = this.todos.concat([{
        title: val,
        completed: false
      }]);
      tpl.focus(el);
      this.displayTodos = this.filters[this.visibility](this.todos)

      console.log(tpl.map(this.displayTodos, function(todo) {
        return todo.title + '(' + todo.completed + ')'
      }).join(', '))
    },
    edit: function(todo) {
      this.edited = todo
    },
    update: function(todo, el) {
      if (!tpl.trim(todo.title)) {
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
      console.log(tpl.map(this.displayTodos, function(todo) {
        return todo.title + '(' + todo.completed + ')'
      }).join(', '))
    },
    toggleAll: function() {
      var done = this.completedNum != this.todos.length,
        completedNum = this.completedNum;
      tpl.$each(this.displayTodos, function(todo) {
        var t = todo.completed
        if (t !== done) {
          todo.completed = done;
          done ? completedNum++ : completedNum--
        }
      })
      this.completedNum = completedNum;
      this.displayTodos = this.filters[this.visibility](this.todos)
      console.log(tpl.map(this.displayTodos, function(todo) {
        return todo.title + '(' + todo.completed + ')'
      }).join(', '))
    },
    toggle: function(todo) {
      todo.completed = !todo.completed;
      if (todo.completed) {
        this.completedNum++;
      } else {
        this.completedNum--;
      }
      this.displayTodos = this.filters[this.visibility](this.todos)
      console.log(tpl.map(this.displayTodos, function(todo) {
        return todo.title + '(' + todo.completed + ')'
      }).join(', '))
    },
    clear: function() {
      tpl.$each(this.todos, function(todo) {
        todo.completed = false;
      })
      this.completedNum = 0;
      this.displayTodos = this.filters[this.visibility](this.todos)
      console.log(tpl.map(this.displayTodos, function(todo) {
        return todo.title + '(' + todo.completed + ')'
      }).join(', '))
    },
    vis: function(type) {
      if (this.visibility !== type) {
        this.visibility = type
        this.displayTodos = this.filters[type](this.todos)
        console.log(tpl.map(this.displayTodos, function(todo) {
          return todo.title + '(' + todo.completed + ')'
        }).join(', '))
      }
    }
  }

  var todoTpl = new tpl(document.getElementById('tpl/todo.html').innerHTML)
    .complie(todo).appendTo('.todoapp')

})
