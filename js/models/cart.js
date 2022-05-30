//---------------------------------------------------------------
//4. Tạo đối tượng Cart
class Cart {
  constructor(Product, quantity = 1) {
    this.product = {
      name: Product.name,
      price: Product.price,
      img: Product.img,
      id: Product.id,
    };
    this.quantity = quantity;
  }
  //---------------------------------------------------------------
  //7. Tính tổng tiền
  total() {
    return this.quantity * this.product.price;
  }
}
