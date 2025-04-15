import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const TagInputComponent = ({ tags , setTags }) => {
    const [text, setText] = useState('');
    const [editIndex, setEditIndex] = useState(null);

    const addTag = () => {
        if (text.trim() !== '') {
            if (editIndex !== null) {

                // If editing an existing tag
                const newTags = [...tags];
                newTags[editIndex] = text.trim();
                setTags(newTags);
                setEditIndex(null);
            } else {

                // If adding a new tag
                setTags([...tags, text.trim()]);
            }
            setText('');
        }
    };

    const removeTag = (index) => {
        const newTags = [...tags];
        newTags.splice(index, 1);
        setTags(newTags);
    };

    const editTag = (index) => {
        const tagToEdit = tags[index];
        setText(tagToEdit);
        setEditIndex(index);
    };

    return (
        <View style={styles.container}>
            <View style={styles.tagContainer}>
                {tags.map((tag, index) => (
                    <View key={index} 
                        style={styles.tagWrapper}>
                        <TouchableOpacity 
                            onPress={() => editTag(index)} 
                            style={styles.tag}>
                            <Text style={styles.tagText}>
                                {tag}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => removeTag(index)} 
                            style={styles.removeButton}>
                            <Text style={styles.removeButtonText}>
                                X
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Ajoute une personne"
                    value={text}
                    onChangeText={setText}
                    onSubmitEditing={addTag}
                />
                <TouchableOpacity onPress={addTag} 
                    style={styles.addButton}>
                    <Text style={styles.buttonText}>
                        {editIndex !== null ? 'Modifier' : 'Ajouter'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const tagInput = () => {
    return (
        <View style={styles.appContainer}>
            <TagInputComponent />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        minWidth: '100%',
        width: '100%',
        paddingHorizontal: 20,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    tagWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#275950',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 5,
        marginBottom: 5, // Permet un bon alignement sur plusieurs lignes
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tagText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
    },
    removeButton: {
        marginLeft: 5,
        padding: 5,
        borderRadius: 50,
        backgroundColor: '#E53935',
    },
    removeButtonText: {
        color: '#FFFFFF',
        fontSize: 10,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#275950',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        marginBottom: 10,
    },
    addButton: {
        width: '100%',
        backgroundColor: '#275950',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TagInputComponent;