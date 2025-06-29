import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Comment } from '../types';

type Props = {
  comment: Comment;
};

export default function CommentCard({ comment }: Props) {
  const avatarUrl = `https://i.pravatar.cc/150?img=${comment.id % 70}`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{comment.name}</Text>
          <Text style={styles.email}>{comment.email}</Text>
        </View>
      </View>
      <Text>{comment.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  email: {
    color: '#888',
    fontSize: 12,
    marginBottom: 2,
  }
});
