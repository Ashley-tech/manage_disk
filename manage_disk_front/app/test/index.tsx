import { StyleSheet } from 'react-native';

export default function HomeScreen() {
    return (<h1 style={styles.heading}>Hello, world</h1>)
}

const styles = StyleSheet.create({
    heading: {
        fontFamily: 'Arial',
    }
});