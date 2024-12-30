import { Image, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { onboarding } from "@/constants";
import CustomButton from "@/components/CustomButton";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const Onboarding = () => {
  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      {/* Skip Button */}
      <TouchableOpacity
        onPress={() => {
          router.replace("/(auth)/sign-up");
        }}
        className="w-full flex justify-end items-end p-5"
      >
        <Text className="text-black text-md font-JakartaBold">Skip</Text>
      </TouchableOpacity>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {onboarding.map((item) => (
          <View
            key={item.id}
            className="mb-10 flex items-center justify-center p-1"
          >
            <Image
              source={item.image}
              className="w-full h-[300px]"
              resizeMode="contain"
            />
            <View className="flex flex-row items-center justify-center w-full mt-10">
              <Text className="text-black text-3xl font-bold mx-10 text-center">
                {item.title}
              </Text>
            </View>
            <Text className="text-center text-lg font-JakartaSemiBold mx-10 mt-3 text-[#858585]">
              {item.description}
            </Text>
          </View>
        ))}
        {/* Get Started Button */}
        <View className="w-full p-5">
          <CustomButton
            title="Get Started"
            onPress={() => router.replace("/(auth)/sign-up")}
            className="w-11/12 mb-10"
          />
        </View>
      </ScrollView>
      {/* Footer Bar */}
      <View className="bg-gray-200 py-4 items-center justify-center absolute bottom-0 w-full">
        <FontAwesome6 name="book-open" size={20} color="black" />
        <Text className="font-bold mt-2 text-black">BookStack</Text>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
