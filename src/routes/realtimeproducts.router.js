import express from 'express';
import ProductManager from '../DAO/productManager.js';
import { checkAdmin } from '../middlewares/auth.js';
import { productService } from '../services/product.service.js';

export const realTimeProducts = express.Router();

const productManager = new ProductManager('db/products.json');

// GET con limit

realTimeProducts.get('/', checkAdmin, async (req, res) => {
  try {
    const queryParams = req.query;
    const user = req.session.firstName;
    const isAdmin = req.session.admin;

    const paginatedProductsResponse = await productService.getAll(queryParams);
    const paginatedProducts = paginatedProductsResponse.modifiedProducts;
    const paginated = paginatedProductsResponse.products;
    console.log(paginated.nextPage);
    res
      .status(200)
      .render('realtimeproducts', {
        products: paginatedProducts,
        paginated: paginated,
        user,
        isAdmin,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET por ID

realTimeProducts.get('/:pid', checkAdmin, async (req, res) => {
  try {
    const id = req.params.pid;
    const productById = await productService.getById(id);

    if (productById) {
      res.status(200).render('realtimeproducts', { productById: [productById] });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
