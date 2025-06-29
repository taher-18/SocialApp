import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Animated, 
  Easing,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle
} from 'react-native';
import { Post } from '../types';
import { getUser } from '../services/posts';
import { MaterialIcons } from '@expo/vector-icons';
import { formatDistance } from 'date-fns/formatDistance';

// Constants
const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const ANIMATION_DURATION = 200;
const SCALE_DOWN_VALUE = 0.98;

interface Props {
  post: Post;
  onPress: () => void;
}

export default function PostCard({ post, onPress }: Props) {
  // State
  const [user, setUser] = useState<{name: string; email: string} | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Refs
  const scaleValue = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const likeScale = useRef(new Animated.Value(1)).current;
  const bookmarkScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser(post.user_id);
        setUser(userData);
      } catch (error) {
        console.error('Error in PostCard:', error);
        setUser({ name: 'Anonymous User', email: 'user@example.com' });
      }
    };

    fetchUser();
  }, [post.user_id]);

  // Animation handlers
  const animatePressIn = (animValue: Animated.Value) => {
    Animated.spring(animValue, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const animatePressOut = (animValue: Animated.Value) => {
    Animated.spring(animValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressIn = () => animatePressIn(scaleValue);
  const handlePressOut = () => animatePressOut(scaleValue);
  const handleLikePressIn = () => animatePressIn(likeScale);
  const handleLikePressOut = () => animatePressOut(likeScale);
  const handleBookmarkPressIn = () => animatePressIn(bookmarkScale);
  const handleBookmarkPressOut = () => animatePressOut(bookmarkScale);

  const handleLike = () => {
    const newLikeState = !isLiked;
    setIsLiked(newLikeState);
    
    if (newLikeState) {
      // Bounce animation for like
      Animated.sequence([
        Animated.spring(translateY, { 
          toValue: -12, 
          useNativeDriver: true,
          speed: 50,
        }),
        Animated.spring(translateY, { 
          toValue: 0, 
          useNativeDriver: true,
          bounciness: 12,
        }),
      ]).start();
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Small bounce effect for bookmark
    Animated.sequence([
      Animated.spring(bookmarkScale, {
        toValue: 1.2,
        useNativeDriver: true,
      }),
      Animated.spring(bookmarkScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Animated styles
  const animatedStyle: StyleProp<ViewStyle> = {
    transform: [{ scale: scaleValue }],
  };

  const likeButtonStyle: StyleProp<ViewStyle> = {
    transform: [
      { scale: likeScale },
      { translateY: translateY }
    ],
  };

  const bookmarkButtonStyle: StyleProp<ViewStyle> = {
    transform: [{ scale: bookmarkScale }],
  };

  // Generate random likes count between 0-1000
  const likesCount = Math.floor(Math.random() * 1000);
  const commentsCount = Math.floor(Math.random() * 100);

  const avatarUrl = `https://i.pravatar.cc/300?img=${post.user_id % 70}`;
  const postDate = post.timestamp ? new Date(post.timestamp) : new Date();
  const formattedDate = formatDistance(postDate, new Date(), { addSuffix: true });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <TouchableWithoutFeedback 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View>
          {/* Header with user info */}
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
                  <MaterialIcons name="person" size={20} color="#666" />
                </View>
              )}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {user?.name || 'Loading...'}
              </Text>
              <Text style={styles.postTime} numberOfLines={1}>
                {formattedDate} • {likesCount} likes
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.menuButton}
              activeOpacity={0.7}
            >
              <MaterialIcons name="more-vert" size={22} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Post content */}
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {post.title}
            </Text>
            
            <Text style={styles.body} numberOfLines={3}>
              {post.body}
            </Text>

            {post.imageUrl ? (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: post.imageUrl }}
                  style={styles.postImage}
                  resizeMode="cover"
                />
              </View>
            ) : null}
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Action buttons */}
      <View style={styles.footer}>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleLike}
            onPressIn={handleLikePressIn}
            onPressOut={handleLikePressOut}
            activeOpacity={0.8}
          >
            <Animated.View style={likeButtonStyle}>
              <MaterialIcons 
                name={isLiked ? 'favorite' : 'favorite-border'} 
                size={24} 
                color={isLiked ? '#ff3b30' : '#666'} 
              />
            </Animated.View>
            <Text style={[styles.actionText, isLiked && styles.likedText]}>
              {likesCount + (isLiked ? 1 : 0)}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onPress}
            activeOpacity={0.8}
          >
            <MaterialIcons 
              name="chat-bubble-outline" 
              size={22} 
              color="#666" 
            />
            <Text style={styles.actionText}>{commentsCount}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            activeOpacity={0.8}
          >
            <MaterialIcons name="share" size={22} color="#666" />
          </TouchableOpacity>
        </View>
        
        <Animated.View style={bookmarkButtonStyle}>
          <TouchableOpacity 
            onPress={handleBookmark}
            onPressIn={handleBookmarkPressIn}
            onPressOut={handleBookmarkPressOut}
            activeOpacity={0.8}
          >
            <MaterialIcons 
              name={isBookmarked ? 'bookmark' : 'bookmark-border'} 
              size={24} 
              color={isBookmarked ? '#007AFF' : '#666'} 
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#2d3748',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
        shadowColor: '#2d3748',
      },
    }),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f2f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
  },
  avatarContainer: {
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 24,
    backgroundColor: '#ffffff',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  avatarPlaceholder: {
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'System',
    fontWeight: '600',
    color: '#1a202c',
    fontSize: 16,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  postTime: {
    fontSize: 13,
    color: '#718096',
    letterSpacing: -0.1,
  },
  menuButton: {
    padding: 8,
    margin: -8,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a202c',
    paddingHorizontal: 16,
    marginBottom: 10,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  body: {
    color: '#4a5568',
    lineHeight: 22,
    fontSize: 15,
    paddingHorizontal: 16,
    marginBottom: 14,
    letterSpacing: -0.1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
    backgroundColor: '#f8fafc',
    ...Platform.select({
      ios: {
        shadowColor: '#2d3748',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
    }),
  },
  postImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#f1f5f9',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#edf2f7',
    backgroundColor: '#fcfdfe',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  actionText: {
    marginLeft: 6,
    color: '#4a5568',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  likedText: {
    color: '#e53e3e',
    fontWeight: '600',
  },
  bookmarkButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
});
