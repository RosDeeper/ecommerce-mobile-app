import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { Product } from "@/constants/types";
import { dummyProducts } from "@/assets/assets";
import Header from "@/components/Header";
import { COLORS } from "@/constants";
import ProductCard from "@/components/ProductCard";

const Shop = () => {
  const [product, setProduct] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchProduct = async (pageNumber = 1) => {
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const start = (pageNumber - 1) * 10;
      const end = start + 10;
      const paginatedData = dummyProducts.slice(start, end);

      if (pageNumber === 1) {
        setProduct(paginatedData);
      } else {
        setProduct((prev) => [...prev, ...paginatedData]);
      }

      setHasMore(end < dummyProducts.length); 
      setPage(pageNumber);
    } catch (error) {
      console.error("Pagination error: ", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && !loading && hasMore) {
      fetchProduct(page + 1);
    }
  };

  useEffect(() => {
    fetchProduct(1);

  }, [])
  
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <Header title="Shop" showBack showCart />

      <View className="flex-row gap-2 mb-3 mx-4 my-2">
        {/* Searchbar */}
        <View className="flex-1 flex-row items-center bg-white rounded-xl border border-gray-100">
          <Ionicons name='search' className="ml-4" size={20} color={COLORS.secondary} />
          <TextInput 
            className="flex-1 ml-2 text-primary px-4 py-3"
            placeholder="Search products..."
            returnKeyType='search'
            />
        </View>

        {/* Filter */}
        <TouchableOpacity className="bg-gray-800 w-12 h-12 items-center justify-center rounded-xl">
          <Ionicons name='options-outline' size={24} color='white' />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center"> 
          <ActivityIndicator size='large' color={COLORS.primary} />
        </View>
      ) : (
        <FlatList 
          data={product} 
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => (
            <ProductCard product={item} />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View className="py-4">
                <ActivityIndicator size='small' color={COLORS.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !loading && (
              <View className="flex-1 items-center justify-center py-20">
                <Text className="text-secondary">No products found</Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Shop;
