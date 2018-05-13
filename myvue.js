//逆向导维，换个角度玩转Vue内部原理


var Vue = (function(root, factory){
	return factory.call(root)
})(this, function(){
	var _VUE = function(opts){
		this.opts = opts;
		this._data = opts.data;
		//原来一个模板对象
		this._el = document.querySelector(opts.el);
		
		//克隆一个模板对象
		this.el = this._el.cloneNode(true);

		this._el.parentNode.appendChild(this.el)

		//从页面中移除，缓存中仍然存在
		this._el.remove();

		for(var property in this._data){
			var value = this._data[property];
			if(value instanceof Array){
				addFunction.call(this, this._data, property, value)
				notify.call(this, this._data, property, value)
			}
		}


		function addFunction(model, property, value){
			var that = this;
			['push', "reverse"].forEach(function(method){
				//数组方法重新定义遵循的原则，数组原来的操作我们不能去改变它
				var ori = Array.prototype[method];
				value[method] = function(){
					var res = ori.apply(this, arguments);
					notify.call(that, model, property, value);
					return res;
				}
			})
		}

		//需要吧我们的更新之后的一个数组数据渲染到我们的页面当中去
		// function notify(model, property, value){
		// 	//console.log(this)；
		// 	//console.log(this.el)
		// 	var ul = this.el.children[0];
		// 	console.log(ul);
		// 	ul.innerHTML = '';
		// 	var list = '';
		// 	for(var i=0; i<value.length; i++){
		// 		list += '<li>'+value[i].name+'</li>';
		// 	}
			
		// 	ul.innerHTML = list;
		// 	// this.el.innerHTML = ul;
		// 	// //console.log(ul);
		// }

		//通过cache去实现一下
		function notify(model, property, value){
			//console.log(this);
			//console.log(this.el)
			var ul = this.el.children[0];

			var caches = this._el.caches = this._el.caches || [];
			
			if(caches.length == 0){
				if(ul.children.length>0){
					this._el.caches.push(ul.children[0]);
				}
			}

			//console.log(caches)
			for(var i=0; i<value.length; i++){
				if(caches[i]){
					caches[i].innerText = value[i].name;
				}else{
					var d = document.createElement("li");
					d.innerHTML = value[i].name;
					caches.push(d);
					ul.appendChild(d);
				}
			}
			//console.log(ul);
			//ul.innerHTML = caches;
			//this.el.innerHTML = ul;
		}
	}


	return _VUE;
})




