import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type Href, Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSignUp } from '@clerk/expo';
import { useState } from 'react';

import { COLORS } from '@/constants';
import Toast from 'react-native-toast-message';

export default function SignUpScreen() {
  const { signUp } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [pendingVerification, setPendingVerification] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSignUpPress = async () => {
    if (!signUp) return;

    if (!emailAddress || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill in all fields'
      });
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await signUp.password({
        emailAddress,
        password,
        firstName, 
        lastName
      });

      if (signUpError) {
        Toast.show({
          type: 'error',
          text1: 'Failed to Sign Up',
          text2: signUpError.message ?? "Something went wrong"
        });
        return;
      }

      const { error: mfaError } = await signUp.verifications.sendEmailCode();

      if (mfaError) {
        Toast.show({
          type: 'error',
          text1: 'Verification Error',
          text2: mfaError.message ?? "Could not send verification code"
        });
        return;
      }

      setPendingVerification(true);
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'System Error',
        text2: err?.message ?? "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!signUp) return;

    if (!code) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Enter verification code'
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code });

      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Failed to Verify',
          text2: error?.message ?? "Invalid code",
        });
        return;
      }

      if (signUp.status === 'complete') {
        await signUp.finalize({
          // Redirect the user to the home page after signing up
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }

            const url = decorateUrl('/');
            router.replace(url as Href);
          },
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Verification incomplete',
          text2: 'Please follow the instructions to complete your sign up.',
        });
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'System Error',
        text2: err?.message ?? "Something went wrong"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center" style={{ padding: 28 }}>
      {!pendingVerification ? (
        <>
          <TouchableOpacity onPress={() => router.push("/")} className="absolute top-12 z-10 ml-4">
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-primary mb-2">Create Account</Text>
            <Text className="text-secondary">Sign up to get started</Text>
          </View>

          {/* First Name */}
          <View className="mb-4">
            <Text className="text-primary font-medium mb-2">First Name</Text>
            <TextInput 
              className="w-full bg-surface p-4 rounded-xl text-primary" 
              placeholder="John" 
              placeholderTextColor="#999" 
              value={firstName} 
              onChangeText={setFirstName} 
            />
          </View>

          {/* Last Name */}
          <View className="mb-6">
            <Text className="text-primary font-medium mb-2">Last Name</Text>
            <TextInput 
              className="w-full bg-surface p-4 rounded-xl text-primary" 
              placeholder="Doe" 
              placeholderTextColor="#999" 
              value={lastName} 
              onChangeText={setLastName} 
            />
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="text-primary font-medium mb-2">Email</Text>
            <TextInput 
              className="w-full bg-surface p-4 rounded-xl text-primary" 
              placeholder="user@example.com" 
              placeholderTextColor="#999" 
              autoCapitalize="none" 
              keyboardType="email-address" 
              value={emailAddress} 
              onChangeText={setEmailAddress} 
            />
          </View>

          {/* Password */}
          <View className="mb-6">
            <Text className="text-primary font-medium mb-2">Password</Text>
            <TextInput 
              className="w-full bg-surface p-4 rounded-xl text-primary" 
              placeholder="********" 
              placeholderTextColor="#999" 
              secureTextEntry 
              value={password} 
              onChangeText={setPassword} 
            />
          </View>

          {/* Submit */}
          <TouchableOpacity 
            className="w-full bg-primary py-4 rounded-full items-center mb-10" 
            onPress={onSignUpPress} 
            disabled={loading}
          >
            {loading 
              ? <ActivityIndicator color="#fff" /> 
              : <Text className="text-white font-bold text-lg">Continue</Text>
            }
          </TouchableOpacity>

          {/* Footer */}
          <View className="flex-row justify-center">
            <Text className="text-secondary">Already have an account? </Text>
            <Link href="/sign-in">
              <Text className="text-primary font-bold">Login</Text>
            </Link>
          </View>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={() => router.back()} className="absolute top-12 z-10">
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Verification */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-primary mb-2">Verify Email</Text>
            <Text className="text-secondary text-center">Enter the code sent to your email</Text>
          </View>

          <View className="mb-6">
            <TextInput 
              className="w-full bg-surface p-4 rounded-xl text-primary text-center tracking-widest" 
              placeholder="123456" 
              placeholderTextColor="#999" 
              keyboardType="number-pad" 
              value={code} 
              onChangeText={setCode}
            />
          </View>

          <TouchableOpacity 
            className="w-full bg-primary py-4 rounded-full items-center" 
            onPress={onVerifyPress} 
            disabled={loading}
          >
            {loading 
              ? <ActivityIndicator color="#fff" /> 
              : <Text className="text-white font-bold text-lg">Verify</Text>
            }
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};
