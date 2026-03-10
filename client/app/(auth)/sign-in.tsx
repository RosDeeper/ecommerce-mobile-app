import { ActivityIndicator, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type Href, Link, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { useSignIn } from '@clerk/expo';
import { useState } from 'react';

import { COLORS } from '@/constants';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, fetchStatus } = useSignIn();

  const [emailAddress, setEmailAddress] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [showEmailCode, setShowEmailCode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSignInPress = async () => {
    if (fetchStatus === 'fetching' || !signIn) return;
    if (!emailAddress || !password) return;

    setLoading(true);

    try {
      const { error } = await signIn.password({
        identifier: emailAddress,
        password,
      });

      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Sign In Failed',
          text2: error.message ?? 'Invalid credentials',
        });
        return;
      }

      if (signIn.status === 'complete') {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            router.replace(decorateUrl("/") as Href);
          },
        });
      } else if (signIn.status === "needs_second_factor" || signIn.status === 'needs_client_trust') {
        const { error: mfaError } = await signIn.mfa.sendEmailCode();

        if (mfaError) {
          Toast.show({
            type: 'error',
            text1: 'Verification Error',
            text2: mfaError.message ?? 'Could not send verification code',
          });
          return;
        }

        setShowEmailCode(true);
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'System Error',
        text2: err?.message ?? 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (fetchStatus === 'fetching' || !signIn || !code) return;

    setLoading(true);

    try {
      const { error } = await signIn.mfa.verifyEmailCode({ code });

      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: error.message ?? 'Invalid code',
        });
        return;
      }

      if (signIn.status === 'complete') {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            router.replace(decorateUrl('/') as Href);
          },
        });
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'System Error',
        text2: err?.message ?? 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center" style={{ padding: 28 }}>
      {!showEmailCode ? (
        <>
          <TouchableOpacity onPress={() => router.push("/")} className="absolute top-12 z-10 ml-4">
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-primary mb-2">Welcome Back</Text>
            <Text className="text-secondary">Sign in to continue</Text>
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
          <Pressable 
            className={`
              w-full py-4 rounded-full items-center mb-10 
              ${loading || !emailAddress || !password ? "bg-gray-300" : "bg-primary"}
            `} 
            onPress={onSignInPress} 
            disabled={loading || !emailAddress || !password}
          >
            {loading 
              ? <ActivityIndicator color="#fff" /> 
              : <Text className="text-white font-bold text-lg">Sign In</Text>
            }
          </Pressable>

          {/* Footer */}
          <View className="flex-row justify-center">
            <Text className="text-secondary">Don&apos;t have an account? </Text>
            <Link href="/sign-up">
              <Text className="text-primary font-bold">Sign up</Text>
            </Link>
          </View>
        </>
      ) : (
        <>
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

          <Pressable 
            className="w-full bg-primary py-4 rounded-full items-center" 
            onPress={onVerifyPress} 
            disabled={loading}
          >
            {loading 
              ? <ActivityIndicator color="#fff" /> 
              : <Text className="text-white font-bold text-lg">Verify</Text>
            }
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
};
