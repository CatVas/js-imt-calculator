(function(){
/*--- ДОПОМІЖНІ ФУНКЦІЇ ---*/
	/*
	 * Функція перевірки "на число":
	 * {param} n - значення, яке перевіряється.
	 **/
	function isNumeric(n){
		return !isNaN( parseFloat(n) ) && isFinite(n);
	}

	/* Список класів DOM-елементу як масив:
	 * {param} DOM DOMElement - DOM-елемент.
	 * Повертає масив присвоєних елементу класів.
	**/
	function classToArray(DOMElement){
		if(!DOMElement){
			throw new Error('DOM-елемент не існує');
		}

		return DOMElement.className.split(' ');
	}
	/* Додати елементу новий клас/класи:
	 * {param} DOM DOMElement - DOM-елемент.
	 * {param} str classes - клас або класи через пробіл.
	**/
	function addClass(DOMElement, classes){
		var elClasses = DOMElement.className;

		elClasses = classToArray(DOMElement);
		classes = classes.split(' ');

		for(var i = 0; i < classes.length; i++){
			for(var j = 0; j < elClasses.length && classes[i] !== elClasses[j]; j++){
				if(elClasses[i] === ''){
					elClasses.splice(i, 1);
				}
				elClasses.push(classes[i]);
			}
		}

		DOMElement.className = elClasses.join(' ');
	}
	/* Видалити клас/класи з елементу:
	 * {param} DOM DOMElement - DOM-елемент.
	 * {param} str classes - клас або класи через пробіл.
	**/
	function removeClass(DOMElement, classes){
		var elClasses = DOMElement.className;

		elClasses = classToArray(DOMElement);
		classes = classes.split(' ');

		for(var i = 0; i < classes.length; i++){
			for(var j = 0; j < elClasses.length; j++){
				if(classes[i] === elClasses[j]){
					elClasses.splice(j, 1);
				}
			}
		}

		DOMElement.className = (elClasses.length > 1) ? elClasses.join(' ')
								: ( (elClasses[0]) || '');
	}


/*--- КОМПОНЕНТИ ---*/
	/*
	 * Компонент "Модель":
	 * conclusionText - тексти підписів під результатом обчислення ІМТ;
	 * getConclusionIMT - метод отримання відповідного підпису залежно від ІМТ;
	 * calculateIMT - метод розрахунку ІМТ.
	**/
	function IMTModel(){
		var conclusionText = [
			'У Вас недостатня маса тіла',
			'Вітаємо! Ваша маса в нормі',
			'На жаль, у Вас передожиріння',
			'На жаль, у Вас ожиріння 1 ступеня',
			'На жаль, у Вас ожиріння 2 ступеня',
			'На жаль, у Вас ожиріння 3 ступеня'
		],
			imt = 0;

		/*
		 * Отримання тексту підпису для відповідного ІМТ:
		 * {param} number imt - значення ІМТ.
		 * Повертає рядок тексту.
		**/
		this.getConclusionIMT = function(imt){
			if(!isNumeric(imt) ){
				throw new Error('Індекс маси тіла має бути числом');
			}

			if(imt < 18.5){
				return conclusionText[0];
			}
			else if(imt < 24.9){
				return conclusionText[1];
			}
			else if(imt < 29.9){
				return conclusionText[2];
			}
			else if(imt < 34.9){
				return conclusionText[3];
			}
			else if(imt < 39.9){
				return conclusionText[4];
			}
			else{
				return conclusionText[5];
			}
		}

		/*
		 * Розрахунок індексу маси тіла (ІМТ):
		 * {param} m - маса тіла, кг;
		 * {param} h - зріст, м.
		 * Повертає числове значення ІМТ.
		**/
		this.calculateIMT = function(m, h){
			if(!isNumeric(h)){
				throw new Error('Значення зросту має бути числом');
			}
			if(!isNumeric(m)){
				throw new Error('Значення маси має бути числом');
			}

			h = h / 100;
			imt = m / (h * h);

			return imt;
		}

		/*
		 * Індекс маси тіла, округлений до 2-х знаків після коми.
		 * Повертає текстове значення.
		**/
		this.showIMT = function(){
			return +(Math.round(imt * 100) / 100).toFixed(2);
		}
	}

	/*
	 * Компонент "Вигляд":
	 * Отримує значення зросту і маси, перевіряє їх коректність.
	 * Виводить значення ІМТ і відповідного підпису в шаблон.
	 * Підсвічує відповідний рядок таблиці.
	 **/
	function IMTView(){
		/*
		 * Метод для взяття вхідних значень зросту і ваги:
		 * {param} DOMElement - DOM-елемент (<input id="..." />), із якого брати значення.
		 * {param} alertMessage - повідомлення про помилку.
		 * Повертає значення, введене користувачем у <input id="..." />.
		**/
		this.getInputValue = function(DOMElement){
			var val = DOMElement.value;

			if(!DOMElement){
				throw new Error('Вхідні параметри: відсутній DOM-елемент');
			}
			if(!isNumeric(val)){
				//alert(alertMessage);
				throw new Error('Будь-ласка, введіть Вашу масу і зріст числами');
			}

			return +parseFloat(val);
		}

		/*
		 * Присвоює текст DOM-елементу:
		 * {param} DOMElement - DOM-елемент для розміщення тексту.
		 * {param} string text - текст висновка-підсумка.
		**/
		this.setInnerText = function(DOMElement, text){
			if(!DOMElement){
				throw new Error('Відсутній DOM-елемент для розміщення тексту');
			}

			DOMElement.innerHTML = text + '';
		}

		/*
		 * Підсвічує рядок таблиці з відповідним значенням ІМТ:
		 * {param} number imt - обчислене значення IMT.
		 * {param} DOM DOMTable - DOM-елемент таблиці.
		**/
		this.enlighten = function(imt, DOMTable){
			if(!DOMTable){
				throw new Error('Не існує дана таблиця для підсвічування рядків');
			}
			if(!isNumeric(imt)){
				throw new Error('Для підсвічування рядка таблиці значення ІМТ має бути числом');
			}

			function removeClassEachEl(els, classes){
				for(var i = 0; i < els.length; i++){
					removeClass(els[i], classes);
				}

				return els;
			}

			var rows = DOMTable.rows;
			imt = +(Math.round(imt * 10) / 10).toFixed(1);

			if(imt < 18.5){
				addClass(removeClassEachEl(rows, 'tab_chosen')[1], 'tab_chosen');
			}
			else if(imt < 25){
				addClass(removeClassEachEl(rows, 'tab_chosen')[2], 'tab_chosen');
			}
			else if(imt < 30){
				addClass(removeClassEachEl(rows, 'tab_chosen')[3], 'tab_chosen');
			}
			else if(imt < 35){
				addClass(removeClassEachEl(rows, 'tab_chosen')[5], 'tab_chosen');
			}
			else if(imt < 40){
				addClass(removeClassEachEl(rows, 'tab_chosen')[6], 'tab_chosen');
			}
			else{
				addClass(removeClassEachEl(rows, 'tab_chosen')[7], 'tab_chosen');
			}
		}
	}

	/*
	 * Компонент "Контроллер":
	 * Виконує всю логіку калькулятора ІМТ.
	**/
	function IMTCalculator(){
		var model = new IMTModel();
		var view = new IMTView();

		this.init = function(){
			try{
				// 1. Беремо значення зросту і ваги з html-полів
				var weight = view.getInputValue(document.getElementById('bodyweight')),
					height = view.getInputValue(document.getElementById('bodyheight'));

				// 2. Обчислення значення ІМТ (формула береться з Model):
				var imt = model.calculateIMT(weight, height);

				// 3. Віддаємо обчислений ІМТ компоненту "Вигляд",
				//    виводимо значення ІМТ і підпис-висновок:
				var conclusion = model.getConclusionIMT(imt);
				view.setInnerText(document.getElementById('data_result_val'), model.showIMT() );
				view.setInnerText(document.getElementById('data_conclusion'), conclusion);

				// 4. Підсвічуємо відповідний рядок таблиці:
				var table = document.getElementById('tab');
				view.enlighten(imt, table);
			}
			catch(err){
				// Оброблення помилок
				alert(err.name + '\n\n' + err.message + '\n\n' + err.stack);
			}
		}
	}

/*--- ЗАПУСК ---*/
	var imtCalc = new IMTCalculator();

	document.getElementById('btn').onclick = function(){
		imtCalc.init();
	};
}());