import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const storageProducts = await AsyncStorage.getItem(
        '@FundamentosReactNative:Products',
      );

      if (storageProducts) {
        setProducts(JSON.parse(storageProducts));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const draft = [...products];

      const productId = draft.findIndex(
        productDraft => productDraft.id === product.id,
      );
      if (productId >= 0) {
        draft[productId].quantity += 1;
      } else {
        draft.push({ ...product, quantity: 1 });
      }
      setProducts(draft);

      await AsyncStorage.setItem(
        '@FundamentosReactNative:Products',
        JSON.stringify(draft),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const draft = [...products];

      const productId = draft.findIndex(product => product.id === id);
      if (productId >= 0) {
        draft[productId].quantity += 1;
      }
      setProducts(draft);

      await AsyncStorage.setItem(
        '@FundamentosReactNative:Products',
        JSON.stringify(draft),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const draft = [...products];

      const productId = draft.findIndex(product => product.id === id);
      if (productId >= 0) {
        if (draft[productId].quantity > 1) {
          draft[productId].quantity -= 1;
        } else {
          draft.splice(productId, 1);
        }
      }

      setProducts(draft);

      await AsyncStorage.setItem(
        '@FundamentosReactNative:Products',
        JSON.stringify(draft),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
