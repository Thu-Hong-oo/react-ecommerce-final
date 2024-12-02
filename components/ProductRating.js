import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';

const ProductRating = () => {
  const reviews = [
    {
      rating: 5,
      comment: 'Sản phẩm đúng mô tả!',
      name: 'Jevon Renoy',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      time: '2 giờ trước',
    },
    {
      rating: 4,
      comment: 'Rất tốt, nhưng cần cải thiện một chút.',
      name: 'Trần Thị B',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      time: '1 ngày trước',
    },
    {
      rating: 3,
      comment: 'Bình thường, không quá ấn tượng.',
      name: 'Lê Văn C',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      time: '3 ngày trước',
    },
    {
      rating: 5,
      comment: 'Hoàn hảo!',
      name: 'Phạm Thị D',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      time: '5 ngày trước',
    },
    {
      rating: 2,
      comment: 'Chất lượng không như mong đợi.',
      name: 'Nguyễn Thị E',
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
      time: '1 tuần trước',
    },
    {
      rating: 1,
      comment: 'Không hài lòng, sản phẩm bị hỏng.',
      name: 'Trần Văn F',
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
      time: '2 tuần trước',
    },
  ];

  // Tính toán tổng sao và trung bình sao
  const totalReviews = reviews.length;
  const totalStars = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = totalStars / totalReviews;

  // Đếm số lượng đánh giá cho từng mức sao
  const starCounts = [1, 2, 3, 4, 5].map((star) => {
    return {
      star,
      count: reviews.filter((review) => review.rating === star).length,
      percentage:
        (reviews.filter((review) => review.rating === star).length /
          totalReviews) *
        100,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Hiển thị trung bình sao và tổng số đánh giá bên trái */}
        <View style={styles.leftContainer}>
          <Text style={styles.avgRatingText}>
            {averageRating.toFixed(1)} / 5
          </Text>
          <Text>({totalReviews}reviews) </Text>
          <AirbnbRating
            count={5}
            defaultRating={averageRating}
            isDisabled
            size={15}
            showRating={false}
          />
        </View>

        {/* Hiển thị thanh tiến trình bên phải */}
        <View style={styles.rightContainer}>
          {starCounts.map(({ star, count, percentage }) => (
            <View key={star} style={styles.starRow}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[styles.progressBarFill, { width: `${percentage}%` }]}
                />
              </View>
              <Text style={styles.countText}>{star}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Hiển thị bình luận */}
      <FlatList
        data={reviews} 
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <View style={styles.userContainer}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
                <AirbnbRating
                  count={5}
                  defaultRating={item.rating}
                  isDisabled
                  size={10}
                  showRating={false}
                 
                />
              </View>
            </View>

            <Text style={styles.commentText}>{item.comment}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#fff',
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding:10,
  },

  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },

  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },

  avgRatingText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },

  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '80%',
  },

  progressBarBackground: {
    height: 8,
    flex: 3,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginRight: 10,
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: 'orange',
    borderRadius: 5,
  },

  countText: {
    fontSize: 16,
    marginLeft: 10,
  },



  reviewItem: {
    marginBottom: 20,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  userInfo: {
    flexDirection: 'column',
  },

  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  timeText: {
    fontSize: 14,
    color: '#777',
  },

  commentText: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default ProductRating;
