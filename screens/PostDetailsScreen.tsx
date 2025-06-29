import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator, 
  Image, 
  ScrollView,
  RefreshControl
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { Comment } from '../types';
import { getComments, getUser } from '../services/posts';
import CommentCard from '../components/CommentCard';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  route: RouteProp<RootStackParamList, 'PostDetails'>;
};

export default function PostDetailsScreen({ route }: Props) {
  const { post } = route.params;
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<{name: string; email: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const avatarUrl = `https://i.pravatar.cc/150?img=${post.user_id % 70}`;

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [userData, commentsData] = await Promise.all([
        getUser(post.user_id).catch(() => ({
          name: 'Anonymous User',
          email: 'user@example.com'
        })),
        getComments(post.id)
      ]);
      
      setUser(userData);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading post details:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [post.id]);

  const renderComment = ({ item }: { item: Comment }) => (
    <CommentCard comment={item} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
      >
        <View style={styles.postCard}>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              {user ? (
                <Image 
                  source={{ uri: avatarUrl }} 
                  style={styles.avatar} 
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <MaterialIcons name="person" size={24} color="#666" />
                </View>
              )}
            </View>
            <View>
              <Text style={styles.userName}>{user?.name || 'Loading...'}</Text>
              <Text style={styles.email}>{user?.email || ''}</Text>
            </View>
          </View>
          
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.body}>{post.body}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.commentsHeader}>
            <MaterialIcons name="comment" size={20} color="#666" />
            <Text style={styles.commentsTitle}>
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator style={styles.loader} color="#007AFF" />
        ) : comments.length > 0 ? (
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderComment}
            scrollEnabled={false}
            contentContainerStyle={styles.commentsList}
          />
        ) : (
          <View style={styles.noComments}>
            <MaterialIcons name="chat-bubble-outline" size={40} color="#ccc" />
            <Text style={styles.noCommentsText}>No comments yet</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    margin: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1a1a1a',
  },
  email: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  commentsList: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  noComments: {
    alignItems: 'center',
    padding: 30,
  },
  noCommentsText: {
    color: '#888',
    marginTop: 10,
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
});
