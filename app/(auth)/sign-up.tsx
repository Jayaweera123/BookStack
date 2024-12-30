import { Image, ScrollView, Text, View, Alert } from "react-native";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { ReactNativeModal } from "react-native-modal";
import { fetchAPI } from "@/lib/fetch";
import useForm from "@/hooks/useForm";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const validationRules = {
    name: { required: true, errorMessage: "Username is required" },
    email: {
      required: true,
      pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      errorMessage: "Invalid email address",
    },
    password: {
      required: true,
      minLength: 6,
      errorMessage: "Password must be at least 6 characters",
    },
  };

  const { form, errors, handleInputChange, validateForm } = useForm(
    { name: "", email: "", password: "" },
    validationRules,
  );

  const onSignUpPress = async () => {
    if (!validateForm()) return;

    if (!isLoaded) return;
    try {
      await signUp.create({
        username: form.name,
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };
  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });
      if (completeSignUp.status === "complete") {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdUserId,
          }),
        });
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({
          ...verification,
          state: "success",
        });
      } else {
        setVerification({
          ...verification,
          error: "Verification failed. Please try again.",
          state: "failed",
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
    }
  };
  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1">
          <View className="relative w-full h-[250px]">
            <Image source={images.ebook} className="z-0 w-full h-[250px]" />
            <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
              Create Your Account
            </Text>
          </View>
          <View className="p-5">
            <InputField
              label="Username"
              placeholder="Enter username"
              icon={icons.person}
              value={form.name}
              onChangeText={(value) => handleInputChange("name", value)}
              error={errors.name}
            />
            <InputField
              label="Email"
              placeholder="Enter email"
              icon={icons.email}
              textContentType="emailAddress"
              value={form.email}
              onChangeText={(value) => handleInputChange("email", value)}
              error={errors.email}
            />
            <InputField
              label="Password"
              placeholder="Enter password"
              icon={icons.lock}
              secureTextEntry={true}
              textContentType="password"
              value={form.password}
              onChangeText={(value) => handleInputChange("password", value)}
              error={errors.password}
            />
            <CustomButton
              title="Sign Up"
              onPress={onSignUpPress}
              className="mt-6"
            />

            <Link
              href="/sign-in"
              className="text-lg text-center text-general-200 mt-10"
            >
              Already have an account?{" "}
              <Text className="text-primary-500">Log In</Text>
            </Link>
          </View>
          <ReactNativeModal
            isVisible={verification.state === "pending"}
            // onBackdropPress={() =>
            //   setVerification({ ...verification, state: "default" })
            // }
            onModalHide={() => {
              if (verification.state === "success") setShowSuccessModal(true);
            }}
          >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Text className="font-JakartaExtraBold text-2xl mb-2">
                Verification
              </Text>
              <Text className="font-Jakarta mb-5">
                We've sent a verification code to {form.email}.
              </Text>
              <InputField
                label={"Code"}
                icon={icons.lock}
                placeholder={"12345"}
                value={verification.code}
                keyboardType="numeric"
                onChangeText={(code) =>
                  setVerification({ ...verification, code })
                }
              />
              {verification.error && (
                <Text className="text-red-500 text-sm mt-1">
                  {verification.error}
                </Text>
              )}
              <CustomButton
                title="Verify Email"
                onPress={onPressVerify}
                className="mt-5 bg-success-500"
              />
            </View>
          </ReactNativeModal>
          <ReactNativeModal isVisible={showSuccessModal}>
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Image
                source={images.check}
                className="w-[110px] h-[110px] mx-auto my-5"
              />
              <Text className="text-3xl font-JakartaBold text-center">
                Verified
              </Text>
              <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
                You have successfully verified your account.
              </Text>
              <CustomButton
                title="Browse Home"
                onPress={() => {
                  setShowSuccessModal(false);
                  router.push({
                    pathname: `/(root)/(tabs)/home`,
                    params: { username: form.name }, // Pass username as a parameter
                  });
                }}
                className="mt-5"
              />
            </View>
          </ReactNativeModal>
        </View>
      </ScrollView>

      {/* Footer Bar */}
      <View className="bg-gray-200 py-4 items-center justify-center absolute bottom-0 w-full">
        <FontAwesome6 name="book-open" size={20} color="black" />
        <Text className="font-bold mt-2 text-black">BookStack</Text>
      </View>
    </View>
  );
};
export default SignUp;
