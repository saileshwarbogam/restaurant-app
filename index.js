var dragItem;
let db = {};
urlMenu = 'menuitems.json';
let menuData;
window.onload = () => {
    sessionStorage.clear();
    fetch(urlMenu)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            menuData = data;
            appendMenu(menuData);
        })
        .catch(function (err) {
            console.log(err);
        })
};
function appendMenu(data) {
    let menuItems = document.querySelector('.menu-items');
    let count = 1;
    for (let i = 0; i < data.length; i++) {
        let item = document.createElement('div');

        item.setAttribute('id', 'menuItem' + count++);
        item.draggable = true;
        let itemName = document.createElement('p');

        itemName.setAttribute('class', 'menu-items-name');
        let text = data[i].name;
        itemName.textContent = text;



        item.appendChild(itemName);

        let courseType = document.createElement('p');
        courseType.textContent = data[i].course;
        courseType.setAttribute('class', 'hidden courseType');
        item.appendChild(courseType);


        item.setAttribute('class', 'item');

        let priceName = document.createElement('span');
        priceName.textContent = "Price : ";
        item.appendChild(priceName);

        let priceElement = document.createElement('span');
        priceElement.setAttribute('class', 'priceOfItem');
        let price = data[i].price;
        priceElement.textContent = price;
        item.appendChild(priceElement);


        item.addEventListener('dragstart', (event) => {
            dragItem = event.target;
            event.target.style.border = '2px solid grey';

        });
        item.addEventListener('dragend', (event) => {
            event.target.style.border = '0px'
        });
        menuItems.appendChild(item);
    }
}
document.querySelectorAll('.table').forEach(e => {
    e.addEventListener('dragover', event => {
        event.preventDefault();
        e.style.backgroundColor = 'grey';
    });
    e.addEventListener('dragleave', () => {
        e.style.backgroundColor = 'white';
    });

    let cost = 0;
    let items = 0;
    e.addEventListener('drop', (event) => {

        event.preventDefault();
        e.style.backgroundColor = '';
        //For cost
        cost += parseInt(dragItem.querySelector('.priceOfItem').textContent);
        let tableCost = e.querySelector('.costTable');
        tableCost.textContent = cost;


        //For total items
        items++;
        let totalItems = e.querySelector('.total-items');
        totalItems.textContent = items;

        addToDb(e.querySelector('.table-name').textContent);
    });
});

function addToDb(tableName) {

    if (db[tableName]) {
        let foodItems = db[tableName];
        if (foodItems.find(item => item.name === dragItem.querySelector(".menu-items-name").textContent)) {
            let item = foodItems.find(item => item.name === dragItem.querySelector(".menu-items-name").textContent);
            item.itemCount += 1;
        }
        else {
            let foodName = {};
            foodName["name"] = dragItem.querySelector(".menu-items-name").textContent;
            foodName["price"] = dragItem.querySelector(".priceOfItem").textContent;
            foodName["itemCount"] = 1;
            foodItems.push(foodName);
        }
    }
    else {
        let foodName = {};
        foodName["name"] = dragItem.querySelector(".menu-items-name").textContent;
        foodName["price"] = dragItem.querySelector(".priceOfItem").textContent;
        foodName["itemCount"] = 1;
        db[tableName] = [foodName];
    }
    console.log(db);
}


let inputMenu = document.querySelector('.search');
inputMenu.addEventListener('keyup', () => {
    const val = inputMenu.value.toLowerCase();
    document.querySelectorAll('.item').forEach(e => {
        if (e.querySelector('.menu-items-name').innerHTML.toLowerCase().indexOf(val) > -1 || e.querySelector('.courseType').innerHTML.toLowerCase().indexOf(val) > -1) {
            e.style.display = '';
        } else {
            e.style.display = 'none';
        }
    });
});


let inputTable = document.querySelector('.search-table');

inputTable.addEventListener('keyup', () => {
    const val = inputTable.value.toLowerCase();
    document.querySelectorAll('.table-name').forEach(e => {
        if (e.innerHTML.toLowerCase().indexOf(val) > -1) {
            e.parentElement.style.display = '';
        } else {
            e.parentElement.style.display = 'none';
        }
    });
});

document.querySelectorAll('.table').forEach(item => {

    item.addEventListener('click', () => {
        document.querySelector('.bg-model').style.display = 'flex';
        let tableName = item.querySelector('.table-name').textContent;
        document.querySelector('.pop-table-name').textContent = tableName + " | Order Details";
        let sNo = 1;

        for(let i=0;i<db[tableName].length;i++){

            let name = db[tableName][i].name;
            let price = db[tableName][i].price;
            let itemCount = db[tableName][i].itemCount;

            let sNo_td = createTd();
            sNo_td.textContent = sNo;
            sNo++;

            let name_td = createTd();
            name_td.innerHTML = name;

            let price_td = createTd();
            price_td.textContent = parseInt(price) * parseInt(itemCount);

            let itemCount_td = createTd();
            let itemCount_input = document.createElement('input');
            itemCount_input.setAttribute('class','no-of-servings');
            itemCount_input.type = "number";
            itemCount_input.min = 1;
            itemCount_input.max = 10;
            itemCount_input.value = itemCount;
            itemCount_td.appendChild(itemCount_input);
            //itemCount_td.textContent = itemCount;


            let delete_td = createTd();

            let trash_span = document.createElement('span');
            let trash_image = document.createElement('img');
            trash_image.src = '/RestaurantApp/trash.png';
            trash_span.appendChild(trash_image);
            delete_td.appendChild(trash_span);

            let table_row = document.createElement('tr');
            table_row.appendChild(sNo_td);
            table_row.appendChild(name_td);
            table_row.appendChild(price_td);
            table_row.appendChild(itemCount_td);
            table_row.appendChild(delete_td);
            table_row.setAttribute('class','table-row');

            let table = document.querySelector('.table-content');
            table.appendChild(table_row);
        }

    });

});

function createTd(){
    return document.createElement('td');
}

function removeTableItems(){
        document.querySelectorAll('.table-row').forEach(e=>{
            e.remove();
        });
}

document.querySelector('.close').addEventListener('click', () => {
    document.querySelector('.bg-model').style.display = 'none';
    removeTableItems();
});









// let db = {
//     "table1": [
//         {
//             name : 'French Fries',
//             price : "120",
//             items : "2"
//         },
//         {
//             name : 'Chicken',
//             price : "120",
//             items : "2" 
//         }
//     ],

//     "table2": [
//         {
//             name : 'French Fries',
//             price : "120",
//             items : "2"
//         },
//         {
//             name : 'Chicken',
//             price : "120",
//             items : "2" 
//         }
//     ]
// }