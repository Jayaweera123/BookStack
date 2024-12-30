import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  FlatList,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { create } from "zustand";
import { icons, images } from "@/constants";
import { useAuth } from "@clerk/clerk-expo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

// Zustand store with proper typing
interface StoreState {
  clickCount: number;
  increment: () => void;
}

const useStore = create<StoreState>((set) => ({
  clickCount: 0,
  increment: () =>
    set((state) => ({
      ...state, // Ensure all properties are preserved
      clickCount: state.clickCount + 1,
    })),
}));

export default function Home() {
  const { username } = useLocalSearchParams(); // Extract username from params
  const [books, setBooks] = useState<any[]>([]); // All books
  const [loading, setLoading] = useState(true); // Loading state
  const [page, setPage] = useState(1); // Current page
  const [itemsPerPage] = useState(5); // Items per page
  const { clickCount, increment } = useStore();
  const { signOut } = useAuth();

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://softwium.com/api/books");
        const data = await response.json();
        console.log("API Response:", data); // Log the data to check its structure
        setBooks(data || []); // Assuming the response is an array of books
      } catch (error) {
        Alert.alert("Error", "Failed to fetch books. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get the current books to display based on the page
  const currentBooks = books.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  // Handle Load More
  const loadMore = () => {
    if (page * itemsPerPage < books.length) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Handle page change (for pagination buttons)
  const goToPage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Calculate total pages based on the number of items
  const totalPages = Math.ceil(books.length / itemsPerPage);

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="flex-1 bg-general-500">
      {/* List of books */}
      <FlatList
        data={currentBooks}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={increment}>
            <View className="px-5 py-3 bg-gray-300 mb-4 rounded-lg m-2">
              <View className="flex flex-row items-center">
                <FontAwesome6 name="book-open" size={15} color="black" />
                <Text className="font-bold ml-2">
                  {item.title || "Untitled"}
                </Text>
              </View>
              <Text>ISBN: {item.isbn}</Text>
              <Text>Page Count: {item.pageCount || "Unknown"}</Text>
              <Text>Authors: {item.authors.join(", ")}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()} // Use the book ID as key
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row items-center justify-between my-5 mx-5">
              <Text className="text-2xl capitalize font-JakartaExtraBold">
                Welcome{", "}
                {username}!
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center w-10 h-10 rounded-full bg-white"
              >
                <Image source={icons.out} className="w-4 h-4" />
              </TouchableOpacity>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No books found<"
                  resizeMode="contain"
                />
                <Text className="text-sm">No books found</Text>
              </>
            )}
          </View>
        )}
        onEndReached={loadMore} // Load more when user reaches the bottom
        onEndReachedThreshold={0.5} // Trigger when the user is 50% from the bottom
        contentContainerStyle={{
          paddingBottom: 2,
        }}
      />

      {/* Pagination Bar */}
      <View className="flex flex-row items-center justify-center space-x-4 my-3 mb-28 gap-x-2">
        <TouchableOpacity
          onPress={() => goToPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 rounded-lg flex items-center justify-center"
          style={{ width: 90 }}
        >
          <Text className="text-white text-center">Previous</Text>
        </TouchableOpacity>
        <Text className="text-lg">
          {page} / {totalPages}
        </Text>
        <TouchableOpacity
          onPress={() => goToPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-500 rounded-lg flex items-center justify-center"
          style={{ width: 90 }} // Same width for the Next button
        >
          <Text className="text-white text-center">Next</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 76,
          right: 20,
          backgroundColor: "#0286FF",
          padding: 20,
          borderRadius: 80,
          alignItems: "center",
          justifyContent: "center",
          elevation: 5,
        }}
        onPress={increment}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>{clickCount}</Text>
      </TouchableOpacity>

      {/* Footer Bar */}
      <View className="bg-gray-200 py-4 items-center justify-center absolute bottom-0 w-full">
        <FontAwesome6 name="book-open" size={20} color="black" />
        <Text className="font-bold mt-2 text-black">BookStack</Text>
      </View>
    </SafeAreaView>
  );
}
