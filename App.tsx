import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [todos, setTodos] = useState<string[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, newTodo.trim()]);
      setNewTodo('');
    }
  };

  const removeTodo = (index: number) => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setTodos(todos.filter((_, i) => i !== index)),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <Text style={styles.title}>Simple Mobile App</Text>
          <Text style={styles.subtitle}>Dockerized Expo App 🐳</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Counter</Text>
          <Text style={styles.counter}>{count}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={() => setCount(count - 1)}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setCount(count + 1)}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={() => setCount(0)}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Greeting</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
          />
          {name ? <Text style={styles.greeting}>Hello, {name}! 👋</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Todo List</Text>
          <View style={styles.todoInput}>
            <TextInput
              style={[styles.input, styles.todoTextInput]}
              placeholder="Add a new todo"
              value={newTodo}
              onChangeText={setNewTodo}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.addButton} onPress={addTodo}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
          {todos.map((todo, index) => (
            <View key={index} style={styles.todoItem}>
              <Text style={styles.todoText}>{todo}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeTodo(index)}>
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Running with Expo! 📱</Text>
          <Text style={styles.footerText}>Built with React Native</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  counter: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#667eea',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 18,
    color: '#667eea',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  todoInput: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  todoTextInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  footer: {
    backgroundColor: '#667eea',
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
});