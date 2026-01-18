const ss = require('simple-statistics');

/**
 * K-Means clustering implementation
 * Groups similar data points together
 */
function kMeansClustering(data, numClusters = 3, maxIterations = 100) {
  try {
    if (data.length < numClusters) {
      return {
        success: false,
        message: 'Number of clusters cannot exceed number of data points'
      };
    }

    // Extract numeric columns
    const numericColumns = getNumericColumns(data);
    if (numericColumns.length === 0) {
      return {
        success: false,
        message: 'No numeric columns found for clustering'
      };
    }

    // Normalize data
    const normalizedData = normalizeData(data, numericColumns);

    // Initialize centroids randomly
    let centroids = [];
    for (let i = 0; i < numClusters; i++) {
      centroids.push(normalizedData[Math.floor(Math.random() * normalizedData.length)]);
    }

    let clusters = [];
    let iteration = 0;
    let centroidsMoved = true;

    while (centroidsMoved && iteration < maxIterations) {
      iteration++;
      centroidsMoved = false;

      // Assign points to nearest centroid
      clusters = Array(numClusters).fill(null).map(() => []);
      
      normalizedData.forEach((point, idx) => {
        let minDistance = Infinity;
        let nearestCluster = 0;

        centroids.forEach((centroid, clusterIdx) => {
          const distance = euclideanDistance(point, centroid);
          if (distance < minDistance) {
            minDistance = distance;
            nearestCluster = clusterIdx;
          }
        });

        clusters[nearestCluster].push({
          index: idx,
          point: point,
          distance: minDistance
        });
      });

      // Calculate new centroids
      const newCentroids = clusters.map(cluster => {
        if (cluster.length === 0) return centroids[0]; // Handle empty clusters
        
        const numDims = cluster[0].point.length;
        const newCentroid = [];

        for (let dim = 0; dim < numDims; dim++) {
          const values = cluster.map(item => item.point[dim]);
          newCentroid.push(ss.mean(values));
        }
        return newCentroid;
      });

      // Check if centroids moved
      centroidsMoved = newCentroids.some((newC, idx) => 
        euclideanDistance(newC, centroids[idx]) > 0.001
      );

      centroids = newCentroids;
    }

    // Generate cluster statistics
    const clusterStats = clusters.map((cluster, idx) => ({
      clusterId: idx,
      size: cluster.length,
      percentage: ((cluster.length / data.length) * 100).toFixed(1),
      points: cluster.map(c => c.index)
    }));

    return {
      success: true,
      numClusters: numClusters,
      iterations: iteration,
      converged: iteration < maxIterations,
      numericColumnsUsed: numericColumns,
      clusterStats: clusterStats,
      totalPoints: data.length,
      silhouetteScore: calculateSilhouetteScore(clusters, centroids).toFixed(3)
    };
  } catch (error) {
    return {
      success: false,
      message: `Error in clustering: ${error.message}`
    };
  }
}

/**
 * Hierarchical clustering - Agglomerative approach
 */
function hierarchicalClustering(data, numClusters = 3) {
  try {
    if (data.length < numClusters) {
      return {
        success: false,
        message: 'Number of clusters cannot exceed number of data points'
      };
    }

    const numericColumns = getNumericColumns(data);
    if (numericColumns.length === 0) {
      return {
        success: false,
        message: 'No numeric columns found'
      };
    }

    const normalizedData = normalizeData(data, numericColumns);

    // Calculate distance matrix
    const distanceMatrix = [];
    for (let i = 0; i < normalizedData.length; i++) {
      distanceMatrix[i] = [];
      for (let j = 0; j < normalizedData.length; j++) {
        distanceMatrix[i][j] = euclideanDistance(normalizedData[i], normalizedData[j]);
      }
    }

    // Initialize clusters
    let clusters = normalizedData.map((point, idx) => ({
      id: idx,
      points: [idx],
      size: 1
    }));

    // Merge clusters until desired number
    while (clusters.length > numClusters) {
      let minDistance = Infinity;
      let mergeI = 0, mergeJ = 1;

      // Find closest pair of clusters
      for (let i = 0; i < clusters.length; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
          const dist = calculateClusterDistance(
            clusters[i].points,
            clusters[j].points,
            distanceMatrix
          );
          if (dist < minDistance) {
            minDistance = dist;
            mergeI = i;
            mergeJ = j;
          }
        }
      }

      // Merge clusters
      clusters[mergeI].points = clusters[mergeI].points.concat(clusters[mergeJ].points);
      clusters[mergeI].size = clusters[mergeI].points.length;
      clusters.splice(mergeJ, 1);
    }

    const clusterStats = clusters.map((cluster, idx) => ({
      clusterId: idx,
      size: cluster.size,
      percentage: ((cluster.size / data.length) * 100).toFixed(1),
      points: cluster.points
    }));

    return {
      success: true,
      method: 'Hierarchical Agglomerative Clustering',
      numClusters: numClusters,
      numericColumnsUsed: numericColumns,
      clusterStats: clusterStats,
      totalPoints: data.length
    };
  } catch (error) {
    return {
      success: false,
      message: `Error in hierarchical clustering: ${error.message}`
    };
  }
}

// Helper functions
function getNumericColumns(data) {
  if (data.length === 0) return [];
  
  const columns = [];
  const firstRow = data[0];
  
  for (const [key, value] of Object.entries(firstRow)) {
    if (!isNaN(parseFloat(value))) {
      columns.push(key);
    }
  }
  return columns;
}

function normalizeData(data, columns) {
  // Calculate min and max for each column
  const minMax = {};
  columns.forEach(col => {
    const values = data.map(row => parseFloat(row[col])).filter(v => !isNaN(v));
    minMax[col] = {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  });

  // Normalize each point
  return data.map(row => {
    return columns.map(col => {
      const val = parseFloat(row[col]);
      const { min, max } = minMax[col];
      return (val - min) / (max - min || 1);
    });
  });
}

function euclideanDistance(point1, point2) {
  let sum = 0;
  for (let i = 0; i < point1.length; i++) {
    sum += Math.pow(point1[i] - point2[i], 2);
  }
  return Math.sqrt(sum);
}

function calculateClusterDistance(cluster1, cluster2, distanceMatrix) {
  let minDist = Infinity;
  cluster1.forEach(i => {
    cluster2.forEach(j => {
      if (distanceMatrix[i] && distanceMatrix[i][j]) {
        minDist = Math.min(minDist, distanceMatrix[i][j]);
      }
    });
  });
  return minDist;
}

function calculateSilhouetteScore(clusters, centroids) {
  let totalScore = 0;
  let count = 0;

  clusters.forEach((cluster, clusterIdx) => {
    cluster.forEach(item => {
      // Distance to own cluster
      const distToOwn = item.distance;

      // Distance to nearest other cluster
      let minDistToOther = Infinity;
      centroids.forEach((centroid, otherIdx) => {
        if (otherIdx !== clusterIdx) {
          const dist = euclideanDistance(item.point, centroid);
          minDistToOther = Math.min(minDistToOther, dist);
        }
      });

      const a = distToOwn;
      const b = minDistToOther;
      const silhouette = (b - a) / Math.max(a, b);
      totalScore += silhouette;
      count++;
    });
  });

  return count > 0 ? totalScore / count : 0;
}

module.exports = {
  kMeansClustering,
  hierarchicalClustering
};
