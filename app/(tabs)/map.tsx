import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '@/components/header';
import { SafeAreaView } from 'react-native-safe-area-context';


const maps = () => {
    return (
        <SafeAreaView>
            <Header />
            <SafeAreaView>
                <View>
                    <Text>maps</Text>
                </View>
            </SafeAreaView>
        </SafeAreaView>

    )
}

export default maps

const styles = StyleSheet.create({})