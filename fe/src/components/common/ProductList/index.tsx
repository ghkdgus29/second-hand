import { Fragment, useEffect, useRef, useState } from 'react';

import { Product } from '@Types/index';

import { ProductItem } from './ProductItem';
import * as S from './style';
interface ProductListProps {
  itemData: Product[];
}

interface ListProps {
  statusCode: number;
  message: string;
  data: {
    products: Product[];
  };
}

export const ProductList = ({ itemData }: ProductListProps) => {
  const productListRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [Products, setProducts] = useState<Product[]>(itemData);

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (productListRef.current) {
        const { bottom } = productListRef.current.getBoundingClientRect();
        if (bottom / 2 <= window.innerHeight && !isLoading) {
          loadMoreData();
        }
      }
    }, 200);
    if (!isLoading) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading]);

  const debounce = <T extends any[]>(
    func: (...args: T) => void,
    delay: number,
  ) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: T) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const loadMoreData = async () => {
    setIsLoading(true);

    await fetch(`http://3.38.73.117:8080/api/products?page=${page}&size=10`)
      .then((response) => response.json())
      .then((productsData) => {
        if (productsData !== undefined) {
          const newData = productsData?.data.products;

          setProducts((prevData) => {
            const updatedData = [...prevData, ...newData];
            return updatedData;
          });
          setPage((prevData) => prevData + 1);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <S.Layout ref={productListRef}>
      <S.TopBox />
      {Products &&
        Products.map((product) => (
          <Fragment key={product.productId}>
            <ProductItem
              imageUrl={product.mainImage.imageUrl}
              title={product.title}
              city={product.location.city}
              town={product.location.town}
              createdAt={product.createdAt}
              price={product.price}
              watchlistCounts={product.watchlistCounts}
              chatroomCounts={product.chatroomCounts}
              status={product.status}
              isCategory={true}
              isCount={true}
            />
            <hr />
          </Fragment>
        ))}
      <S.BottomBox />
    </S.Layout>
  );
};
