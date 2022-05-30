let productList = [];

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
//Hiển thị danh sách sản phẩm
const renderProduct = (data) => {
  let htmlContent = "";
  data?.map((item) => {
    return (htmlContent += `
        <tr>
        <td>${item.id}</td>
        <td> <img src=${item.img} class="img-fluid cart-img"/></td>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>${item.quantity}</td>
        <td>${item.type}</td>
        <td>
        <button class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modal" onclick="renderProductDetails('${item.id}')">Detail</button>
        <button class="btn btn-danger" onclick="handleDeleteProduct('${item.id}')">Delete</button>
        </td>
        </tr>
        `);
  });
  document.getElementById("productListAdmin").innerHTML = htmlContent;
};

//---------------------------------------------------------------
//Hiển thị chi tiết sản phẩm
const renderProductDetails = async (id) => {
  let item;

  try {
    const res = await axios({
      url: `https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/${id}`,
      method: "GET",
    });
    item = res.data;
    // console.log(item);
  } catch (err) {
    console.log(err);
  }

  document.getElementById("js-create").style.display = "none";
  document.getElementById("js-update").style.display = "block";
  document.getElementById("js-idForm").style.display = "block";
  document.getElementById("js-nameForm").classList.remove("col-12");
  document.getElementById("js-id").disabled = true;

  document.getElementById("js-id").value = item.id;
  document.getElementById("js-name").value = item.name;
  document.getElementById("js-screen").value = item.screen;
  document.getElementById("js-backCamera").value = item.backCamera;
  document.getElementById("js-frontCamera").value = item.frontCamera;
  document.getElementById("js-img").value = item.img;
  document.getElementById("js-price").value = item.price;
  document.getElementById("js-quantity").value = item.quantity;
  document.getElementById("js-desc").value = item.desc;

  const options = document.getElementById("js-type");
  for (let index in options.children) {
    if (options.children[index].textContent === item.type)
      return (options.selectedIndex = index);
  }
};

//---------------------------------------------------------------
// Lọc theo loại sản phẩm
const filterProduct = () => {
  document
    .getElementById("js-selectFilterAdmin")
    .addEventListener("change", (e) => {
      if (e.target.value === "0") return renderProduct(productList);

      let filterProductList = productList.filter((item) => {
        if (item.type === e.target.selectedOptions[0].innerHTML) return item;
      });
      renderProduct(filterProductList);
    });
};

//---------------------------------------------------------------
//Thêm mới sản phẩm
const handleCreateProduct = () => {
  if (!validateForm()) return;

  const id = document.getElementById("js-id").value;
  const name = document.getElementById("js-name").value;
  const screen = document.getElementById("js-screen").value;
  const backCamera = document.getElementById("js-backCamera").value;
  const frontCamera = document.getElementById("js-frontCamera").value;
  const img = document.getElementById("js-img").value;
  const type =
    document.getElementById("js-type").selectedOptions[0].textContent;
  const price = document.getElementById("js-price").value;
  const quantity = document.getElementById("js-quantity").value;
  const desc = document.getElementById("js-desc").value;

  const newProduct = new Product(
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type,
    id,
    quantity
  );

  axios({
    url: `https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products`,
    method: "POST",
    data: newProduct,
  })
    .then((res) => {
      // console.log(res);
      logger("alert-success", "* Thêm sản phẩm thành công!");
      fetchProduct(productList);
      document.getElementById("js-reset").click();
      document.getElementById("js-close").click();
    })
    .catch((err) => console.log(err));
};

//---------------------------------------------------------------
//Cập nhật sản phẩm
const handleUpdateProduct = () => {
  if (!validateForm()) return;

  const id = document.getElementById("js-id").value;
  const name = document.getElementById("js-name").value;
  const screen = document.getElementById("js-screen").value;
  const backCamera = document.getElementById("js-backCamera").value;
  const frontCamera = document.getElementById("js-frontCamera").value;
  const img = document.getElementById("js-img").value;
  const type =
    document.getElementById("js-type").selectedOptions[0].textContent;
  const price = document.getElementById("js-price").value;
  const quantity = document.getElementById("js-quantity").value;
  const desc = document.getElementById("js-desc").value;

  const updatedProduct = new Product(
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type,
    id,
    quantity
  );

  axios({
    url: ` https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/${id}`,
    method: "PUT",
    data: updatedProduct,
  })
    .then((res) => {
      console.log(res);
      fetchProduct(productList);
      logger("alert-info", "* Cập nhật sản phẩm thành công!");
      document.getElementById("js-reset").click();
      document.getElementById("js-close").click();
    })
    .catch((err) => console.log(err));
};

//---------------------------------------------------------------
//Xóa sản phẩm
const handleDeleteProduct = (id) => {
  const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm!");
  if (!isConfirm) return;
  axios({
    url: ` https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/${id}`,
    method: "DELETE",
  })
    .then((res) => {
      // console.log(res);
      fetchProduct(productList);
      logger("alert-danger", "* Xóa sản phẩm thành công!");
    })
    .catch((err) => console.log(err));
};
fetchProduct();
filterProduct();

//---------------------------------------------------------------
//Validate
const validateForm = () => {
  const id = document.getElementById("js-id").value;
  const name = document.getElementById("js-name").value;
  const screen = document.getElementById("js-screen").value;
  const backCamera = document.getElementById("js-backCamera").value;
  const frontCamera = document.getElementById("js-frontCamera").value;
  const img = document.getElementById("js-img").value;
  const type =
    document.getElementById("js-type").selectedOptions[0].textContent;
  const price = document.getElementById("js-price").value;
  const quantity = document.getElementById("js-quantity").value;
  const desc = document.getElementById("js-desc").value;

  const numberPattern = /^[0-9]+$/;

  let isValid = true;
  isValid &= required(name, "js-nameAlert");
  isValid &= required(img, "js-imgAlert");
  isValid &=
    required(price, "js-priceAlert") &&
    pattern(price, "js-priceAlert", numberPattern) &&
    checkValue(
      price,
      "js-priceAlert",
      1000,
      "* Giá trị thấp nhất phải là 1000 và là bội số của 1000!",
      () => {
        return price % 1000 === 0;
      }
    );
  isValid &=
    required(quantity, "js-quantityAlert") &&
    pattern(quantity, "js-quantityAlert", numberPattern) &&
    checkValue(quantity, "js-quantityAlert", 1);

  return isValid;
};

const required = (value, spanId, message) => {
  if (!value) {
    document.getElementById(spanId).innerHTML =
      message || `* Trường này không được để trống!`;
    return false;
  }
  document.getElementById(spanId).innerHTML = ``;
  return true;
};

var pattern = function (value, spanId, regex, message) {
  if (!regex.test(value)) {
    document.getElementById(spanId).innerHTML =
      message || `* Không đúng định dạng!`;
    return false;
  }
  document.getElementById(spanId).innerHTML = ``;
  return true;
};

var checkValue = function (value, spanId, min, message, func) {
  console.log(value);
  if (value < min || (func && !func())) {
    document.getElementById(spanId).innerHTML =
      message || `* Giá trị thấp nhất phải là ${min}!`;
    return false;
  }
  document.getElementById(spanId).innerHTML = ``;
  return true;
};

//---------------------------------------------------------------
//Logger
const logger = (className, textAlert) => {
  const alertTag = document.getElementById("js-adminAlert");
  alertTag.style.display = "block";
  alertTag.className = `alert ${className}`;
  alertTag.innerHTML = textAlert;
};

//---------------------------------------------------------------
document.getElementById("js-add").addEventListener("click", () => {
  document.getElementById("js-id").disabled = false;
  document.getElementById("js-idForm").style.display = "none";
  document.getElementById("js-nameForm").classList.add("col-12");
  document.getElementById("js-reset").click();
  document.getElementById("js-create").style.display = "block";
  document.getElementById("js-update").style.display = "none";
});
