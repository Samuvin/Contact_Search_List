import { Trie } from "./Trie.js";

onload = function () {
	const templates = document.getElementsByTagName("template")[0];
	const contact_item = templates.content.querySelector("div");
	const add = document.getElementById("add");
	const contact_info = document.getElementById("contact_input");
	const del = document.getElementById("del");
	const delete_info = document.getElementById("delete_input");
	const info = document.getElementById("info");
	const contact_list = new Trie();

	add.onclick = function () {
		let details = contact_info.value;
		details = details.split(",");
		if (details.length !== 2) {
			alert("Incorrectly formatted input");
			return;
		}
		details[0] = details[0].trim();
		details[1] = details[1].trim();
		if (details[1].length !== 10) {
			alert("Incorrectly formatted input");
			return;
		}
		contact_list.add(details[1], details[0]);
		info.innerHTML += details + " added to contact list<br>";
		contact_info.value = "";
	};

	del.onclick = function () {
		let details = delete_info.value.trim();
		if (details.length !== 10) {
			alert("Incorrectly formatted input");
			return;
		}
		contact_list.del(details);
		info.innerHTML += details + " deleted from contact list<br>";
		delete_info.value = "";
	};

	let autocomplete = (inp) => {
		let currentFocus;
		inp.input = "";
		inp.addEventListener("input", function (e) {
			let a,
				val = this.value;
			closeAllLists();
			currentFocus = -1;
			a = document.createElement("DIV");
			a.setAttribute("id", this.id + "autocomplete-list");
			a.setAttribute("class", "autocomplete-items list-group text-left");
			this.parentNode.appendChild(a);
			let arr = [];
			if (val.length === this.input.length) {
				arr = contact_list.findNext(-2);
			} else if (val.length < this.input.length) {
				this.input = val;
				arr = contact_list.findNext(-1);
			} else {
				this.input = val;
				arr = contact_list.findNext(this.input[this.input.length - 1]);
			}
			for (let i = 0; i < Math.min(arr.length, 6); i++) {
				let item = contact_item.cloneNode(true);
				item.querySelector("#Name").innerText = arr[i].name;
				item.querySelector("#Number").innerHTML =
					"<strong>" +
					arr[i].number.substr(0, val.length) +
					"</strong>" +
					arr[i].number.substr(val.length);
				item.number = arr[i].number;
				item.addEventListener("click", function (e) {
					inp.value = "";
					closeAllLists();
					alert("Calling " + item.number);
				});
				a.appendChild(item);
			}
		});
		inp.addEventListener("keydown", function (e) {
			let x = document.getElementById(this.id + "autocomplete-list");
			if (x) x = x.getElementsByTagName("div");
			if (e.keyCode === 40) {
				currentFocus++;
				addActive(x);
			} else if (e.keyCode === 38) {
				currentFocus--;
				addActive(x);
			} else if (e.keyCode === 13) {
				e.preventDefault();
				if (currentFocus > -1) {
					if (x) x[currentFocus * 2].click();
				}
			}
		});

		let addActive = (x) => {
			if (!x) return false;
			removeActive(x);
			if (currentFocus >= x.length) currentFocus = 0;
			if (currentFocus < 0) currentFocus = x.length - 1;
			x[currentFocus * 2].classList.add("active");
		};

		let removeActive = (x) => {
			for (let i = 0; i < x.length; i++) {
				x[i].classList.remove("active");
			}
		};

		let closeAllLists = (elmnt) => {
			const x = document.getElementsByClassName("autocomplete-items");
			for (let i = 0; i < x.length; i++) {
				if (elmnt !== x[i] && elmnt !== inp) {
					x[i].parentNode.removeChild(x[i]);
				}
			}
		};

		document.addEventListener("click", function (e) {
			closeAllLists(e.target);
		});
	};
	autocomplete(document.getElementById("myInput"));
};
