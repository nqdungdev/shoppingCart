// import Product from "./models/product.js";
// import Product from "./models/cart.js";

let productList = [];
let cartList = [];

//---------------------------------------------------------------
//Lấy dữ liệu từ database
const fetchProduct = async () => {
  try {
    const res = await axios({
      url: `https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products`,
      method: "GET",
    });
    productList = res.data;
    renderProduct(productList);
  } catch (err) {
    console.log(err);
  }
};

//---------------------------------------------------------------
//1. Hiển thị danh sách sản phẩm cho khách hàng
const renderProduct = (data) => {
  let htmlContent = "";

  data?.map((item) => {
    return (htmlContent += `
        <div class="col-4 my-3">
          <div class="card bg-light">
            <div class="card-header bg-white">
            <img src=${item.img} class="img-fluid product-img"/>
            </div>
              <div class="card-body bg-light">
              <h5 class="card-title product-title">${item.name}</h5>
              <p class="card-text product-desc">Desc: ${item.desc}</p>
              <p class="card-text">Type: ${item.type}</p>
              <p class="card-text">Price: ${item.price} VND</p>
              <div class="card-footer bg-light d-flex justify-content-between">
              <button type="button" class="btn btn-info" onclick="renderDetailProduct('${item.id}')" data-bs-toggle="modal" data-bs-target="#detailModal">
              Detail
              </button>
              <button class="btn btn-success" onclick="selectedProduct('${item.id}')">Add to cart</button>
              </div>
              </div>      
          </div>
        </div>
        `);
  });
  document.getElementById("js-productList").innerHTML = htmlContent;
};

//---------------------------------------------------------------
//Hiển thị chi tiết sản phẩm
const renderDetailProduct = (id) => {
  let htmlContent = "";
  const item = findById(productList, id);

  htmlContent = `
                  <h6>${item.name}</h6>
                  <div class="row">
                      <div class="my-3 col-4"><img src=${item.img} class="img-fluid"/></div>
                      <div class="col-8">
                      <div class="row">
                      <div class="mt-3 col-7">
                        <p>Screen: ${item.screen}</p>
                        <p>Back Camera: ${item.backCamera}</p>
                        <p>Front Camera: ${item.frontCamera}</p>
                      </div>
                      <div class="mt-3 col-5">
                        <p>Type: ${item.type}</p>
                        <p>Price: ${item.price} VDN</p>
                        <p>Quantity: ${item.quantity}</p>
                      </div>
                      <div class="mb-3 col-12">
                        <p>Desc: ${item.desc}</p>
                      </div>
                      </div>
                    </div>
                  </div>
        `;

  document.getElementById("js-detailModal").innerHTML = htmlContent;
};

//---------------------------------------------------------------
//2. Lọc theo loại sản phẩm
const filterProduct = () => {
  document.getElementById("js-selectFilter").addEventListener("change", (e) => {
    if (e.target.value === "0") return renderProduct(productList);

    let filterProductList = productList.filter((item) => {
      if (item.type === e.target.selectedOptions[0].innerHTML) return item;
    });
    renderProduct(filterProductList);
  });
};

//---------------------------------------------------------------
//Tìm sản phẩm theo id
const findById = (listData, id) => {
  return listData.find((item) => {
    return item.id === id;
  });
};

//---------------------------------------------------------------
//3. Chọn sản phẩm bỏ vào giỏ hàng
const selectedProduct = (id) => {
  //5. Nếu chưa có thì push với quantity là 1, nếu có rồi thì không push nữa mà chỉ tăng quantity lên 1

  return (
    cartList.find((item) => {
      if (item.product.id === id) {
        increase(item.product.id);
        logger("alert-warning", "* Sản phẩm đã có trong giỏ hàng!");
        return true;
      }
      return false;
    }) ||
    productList.find((item) => {
      if (item.id === id) {
        let itemCart = new Cart(item);
        cartList.push(itemCart);
        saveData();
        renderCart();
        logger("alert-success", "* Thêm vào giỏ hàng thành công!");
        return true;
      }
      return false;
    })
  );
};

//---------------------------------------------------------------
//5. In giỏ hàng ra màn hình
const renderCart = () => {
  let htmlContent = "";
  let sum = 0;
  cartList.map((item) => {
    //---------------------------------------------------------------
    //7. Tính tổng tiền
    sum += item.total();

    return (htmlContent += `
        <tr>
        <td>
          <img src=${item.product.img} class="img-fluid cart-img" >
        </td>
        <td>${item.product.name}</td>
        <td>${item.product.price}</td>
        <td>
          <button class="btn btn-warning me-1" onclick="decrease('${
            item.product.id
          }')">-</button>
          ${item.quantity}
          <button class="btn btn-warning ms-1" onclick="increase('${
            item.product.id
          }')">+</button>
        </td>
         <td>${item.total()}</td>
        <td><button class="btn btn-danger" onclick="handleDeleteItem('${
          item.product.id
        }')">Remove</button></td>
        </tr>
        `);
  });
  document.getElementById("js-cartList").innerHTML = htmlContent;
  if (cartList.length === 0) {
    document.getElementById("cart").style.display = "none";
    document.getElementById("cart-title").style.display = "none";
  } else {
    document.getElementById("cart").style.display = "block";
    document.getElementById("cart-title").style.display = "block";
  }

  document.getElementById("js-textTotal").innerHTML = sum;
};

//---------------------------------------------------------------
//6. Tăng giảm số lượng
const increase = (id) => {
  let itemProduct = findById(productList, id);
  let totalQuantity = itemProduct.quantity;
  // let itemCart = findById(cartList, id);
  let itemCart = cartList.find((item) => {
    return item.product.id === id;
  });
  if (itemCart && itemCart.quantity < totalQuantity) {
    itemCart.quantity++;
    saveData();
    renderCart();
  }
};

const decrease = (id) => {
  // let itemCart = findById(cartList, id);
  let itemCart = cartList.find((item) => {
    return item.product.id === id;
  });
  if (itemCart && itemCart.quantity > 0) {
    itemCart.quantity--;
    saveData();
    renderCart();
  }
};

//---------------------------------------------------------------
//8. Thanh toán
const handlePurchase = () => {
  const isConfirm = confirm(`Xác nhận thanh toán!`);
  if (isConfirm) {
    cartList = [];
    saveData();
    renderCart();
    logger("alert-info", "* Thanh toán thành công!");
  } else return;
};

//---------------------------------------------------------------
//9. Lưu localStorage
const saveData = () => {
  localStorage.setItem("cartList", JSON.stringify(cartList));
};

const loadData = () => {
  if (localStorage.getItem("cartList")) {
    cartList = mapData(JSON.parse(localStorage.getItem("cartList")));
    renderCart();
  }
};

const mapData = (data) => {
  let currentItem;
  return data.map((item) => {
    currentItem = new Cart(item.product, item.quantity);
    return currentItem;
  });
};

//---------------------------------------------------------------
//10. Remove sản phẩm ra khỏi giỏ hàng
const handleDeleteItem = (id) => {
  const isConfirm = confirm("Bạn có chắc chắn muốn xóa khỏi giỏ hàng!");
  if (isConfirm) {
    const index = cartList.findIndex((item) => {
      return item.product.id === id;
    });
    cartList.splice(index, 1);
    saveData();
    renderCart();

    logger("alert-danger", "* Xóa sản phẩm thành công!");
  } else return;
};

//---------------------------------------------------------------
//Logger
const logger = (className, textAlert) => {
  const alertTag = document.getElementById("js-alert");
  alertTag.style.display = "block";
  alertTag.className = `alert ${className}`;
  alertTag.innerHTML = textAlert;
};

//---------------------------------------------------------------
loadData();
renderCart();
filterProduct();
fetchProduct();
