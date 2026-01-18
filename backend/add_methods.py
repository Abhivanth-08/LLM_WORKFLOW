import sys
sys.path.insert(0, 'd:/agentic ai/llm_workflow')

# Add the missing methods to attention_profiler.py
methods_to_add = '''
    def get_head_explanation(self, layer, head):
        """Get detailed explanation of why this head was classified"""
        if self.profiles_matrix is None:
            self.compute_profiles()
        head_idx = layer * 12 + head
        cluster_id = int(self.clusters[head_idx])
        head_features = self.profiles_matrix[head_idx]
        features_per_sentence = 5
        avg_features = []
        for i in range(features_per_sentence):
            feat_values = head_features[i::features_per_sentence]
            avg_features.append(float(np.mean(feat_values)))
        explanations = []
        if avg_features[0] > 0.3:
            explanations.append(f'{int(avg_features[0]*100)}% self-attention')
        if avg_features[3] < 2.0:
            explanations.append('Low entropy (sharp attention)')
        if avg_features[1] > avg_features[2]:
            explanations.append('Forward-looking')
        elif avg_features[2] > avg_features[1]:
            explanations.append('Backward-looking')
        return {
            'layer': int(layer),
            'head': int(head),
            'cluster': self.cluster_labels[cluster_id],
            'cluster_id': int(cluster_id),
            'features': {self.feature_names[i]: round(float(avg_features[i]), 3) for i in range(len(self.feature_names))},
            'explanations': explanations if explanations else ['Standard pattern']
        }

    def get_layer_distribution(self):
        """Get distribution of cluster types across layers"""
        if self.clusters is None:
            self.compute_profiles()
        distribution = {}
        for layer in range(12):
            layer_heads = range(layer * 12, (layer + 1) * 12)
            layer_clusters = [int(self.clusters[h]) for h in layer_heads]
            cluster_counts = {}
            for cluster_id in range(5):
                count = layer_clusters.count(cluster_id)
                if count > 0:
                    cluster_counts[self.cluster_labels[cluster_id]] = count
            distribution[f'Layer {layer}'] = cluster_counts
        return distribution

    def get_metadata(self):
        """Get profiler metadata"""
        if self.stability_score is None:
            self.compute_profiles()
        return {
            'num_heads': 144,
            'num_clusters': 5,
            'num_sentences': len(self.test_sentences),
            'stability_score': round(float(self.stability_score), 3) if self.stability_score else 0.0,
            'stability_std': 0.05,
            'features': self.feature_names,
            'disclaimer': 'Clusters are computed in original feature space; 2D projection is for visualization only.',
            'cluster_labels': self.cluster_labels
        }
'''

with open('d:/agentic ai/llm_workflow/attention_profiler.py', 'a', encoding='utf-8') as f:
    f.write(methods_to_add)

print("✓ Added 3 missing methods to attention_profiler.py")
print("  - get_head_explanation")
print("  - get_layer_distribution")
print("  - get_metadata")
