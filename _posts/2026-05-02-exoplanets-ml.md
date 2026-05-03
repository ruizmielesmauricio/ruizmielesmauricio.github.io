---
layout: post
title: "Exoplanets: Training classification ML models"
categories: [machine-learning]
image: /assets/img/exoplanets.jpg
---

I always found space fascinating but it was only until 2018 when for the very first time I read Stephen Hawking’s ‘The Theory of Everything’ that I started understanding in a much deeper and scientific level definitions within the astronomic field, what we have learned after thousands of years and what we are still trying to understand from the little information we have managed to gather during our whole existence. 

Having learned so many new things related to our origins, black holes and so many other topics mentioned in the book, I got more a more interested in astrophysics so I kept doing my personal research with the hope to understand more about such a complex subject. 

One of those topics are exoplanets. Exoplanets  is a combination of extrasolar and planets, meaning that they are any planet orbiting a star outside the solar system. 
In 2009 NASA launched its Kepler telescope which main purpose was to find other possible earth sized planets outside our solar system. The telescope collected information until 2018 when it ran out of fuel. 
How could this be done? The Kepler telescope was sent to outer space to gather different data from the stars it was observing. It used the transit method that could help identify potential celestial objects by measuring how the stars’ brightness would dim and how often when it passed in front of the star. This information could be used to identify patterns and understand why the stars’ light was dimming, by how much, how periodically it happens allowing to calculate the size of the object that was causing the dimming (if it was an actual object and not another phenomenon). 

The data was transmitted from Kepler’s solid state memory to NASA by scheduled radio communication about once a month. 
The dataset is named Kepler Objects of Interest (KOI) and has been made public and used universally to build machine learning projects. This contains information related to celestial objects observed by the telescope. 

Stellar data from the Kepler Input Catalog (KIC, DR25) were incorporated into the research to evaluate whether combining stellar and object-level information improves classification accuracy in the models. The KIC provides estimated physical and photometric properties of stars within Kepler’s field of view, while the KOI catalog contains parameters related to detected transit signals and candidate celestial objects derived from Kepler light-curve observations.

In my case, the main purpose of the machine learning project built was to use such information to improve classification accuracy by adding extra data that seemed relevant and evaluate which models would perform better. 

## Models: 
Five different algorithms were used to classify the data: Random Forest, Extreme Gradient Boosting (XGBoost) , Support Vector Machine, K-Nearest Neighbors(KNN), and Multi-Layer Perceptron (MLP).

### Why?
The main reason was to compare these models’ performance and see which one produced more accurate results. Besides this, some previous research have worked on similar projects but using a single model and only KOI data. 

The two datasets had 60 different features:
KOI: with 49 planetary features 
KIC: with 11 star features

### EDA: 
Firstly, irrelevant data to KOI in KIC was filtered out. Duplicated values in KOI were removed. These two steps helped creating a merged dataset that is clean and will feed only valuable information to the models. 
Having done this and merging both datasets missing values were checked. It was identified that there were missing values in 39 features which were filled after using median imputation to determine whether it was or not safe to use the median in these  data points. 
Variance was also checked to understand which features will be more important to the model to produce accurate results. A total of 16 features were dropped as they only had 0.01 variance. 
In order to avoid multicollinearity correlations were studied ending on dropping four features that had high correlation with other 4 features. This was done to avoid feeding redundant data to the models. 
Some outliers were identified in the EDA process and were treated using Log Transformation and Winsorization. 
Finally, as some models are sensitive to different scales or magnitudes. Z Score was used to scale three features making sure that all features contribute in the same scale. This transformation was only done for the dataset used in the non tree decision models. 
The data was imbalanced after checking the distribution of the target variable. More false positives were found in the dataset than confirmed or potential exoplanets. This could lead to have a biased model so Synthetic Minority Over-sampling Technique (SMOTE) was used to avoid this problem but it was only applied to the dataset used for distance models (KNN, SVM, MLP). INSERT THE FIGURE IN THE REPORT

### Feature Engineering: 
Three new features were introduced to the dataset:

Planet Ratio to Star: A new feature was calculated which measures the ratio of the observed object compared to the star. 

Depth ratio to Planet Radius: It was used to identify the transit based on the planet’s radius.

Duration Ratio: It was calculated the proportion of the duration of the transit compared to the orbital period.

## Results: 

All models were trainee using a partition 80/20 (80% training- 20% testing). 


### By model

#### XGBoost:
 Prediction Results: Using a confusion matrix, it is possible to identify the total of correct results (figure 12). It is shown that the model has high accuracy at predicting false positives and confirmed exoplanets. This supports the F1-Score results that the model is accurate predicting correctly the three classes. The model can clearly differ between false positives and confirmed.
![Confusion Matrix](https://raw.githubusercontent.com/ruizmielesmauricio/exoplanets-ml/refs/heads/main/Results/cm_xgboost.png)

#### Random Forest:

Prediction Results: Using a confusion matrix, it is possible to identify the total of correct results (figure 14). It is shown that the model has high accuracy at predicting false positives and confirmed exoplanets. This supports the F1-Score results that the model is accurate predicting correctly the three classes. The model can clearly differ between false positives and confirmed.
![Confusion Matrix](https://github.com/ruizmielesmauricio/exoplanets-ml/blob/98d4584e6c782548ec9b7445bdde6491b69e82c6/Results/cm_random_forest.png)

#### SVM:

Prediction Results: Using a confusion matrix, it is possible to identify the total of correct results (figure 16). It is shown that the model has high accuracy at predicting false positives and confirmed exoplanets. This supports the F1-Score results that the model is accurate predicting correctly the three classes. The model can clearly differ between false positives and confirmed.
![Confusion Matrix](https://github.com/ruizmielesmauricio/exoplanets-ml/blob/98d4584e6c782548ec9b7445bdde6491b69e82c6/Results/cm_svm.png)

#### KNN:

Prediction Results: Using a confusion matrix, it is possible to identify the total of correct results (figure 18). It is shown that the model has high accuracy at predicting false positives and confirmed exoplanetsbut struggles predicting candidates (class 1) accurately. This supports the F1-Score results that the model is accurate predicting correctly the three classes. The model can clearly differ between false positives and confirmed. KNN captured confirmed planet accurately but its accuracy for class 2 (confirmed) is lower than the previous models. 
![Confusion Matrix](https://github.com/ruizmielesmauricio/exoplanets-ml/blob/98d4584e6c782548ec9b7445bdde6491b69e82c6/Results/cm_knn.png)

#### MLP:

Prediction Results: Using a confusion matrix, it is possible to identify the total of correct results (figure 20). It is shown that the model has high accuracy at predicting false positives and confirmed exoplanets but struggles predicting candidates (class 1) accurately. This supports the F1-Score results that the model is accurate predicting correctly the three classes. The model can clearly differ between false positives and confirmed. MLP captured confirmed planet accurately but its accuracy for class 2 (confirmed) is the lowest of all the previous models.  
![Confusion Matrix](https://github.com/ruizmielesmauricio/exoplanets-ml/blob/98d4584e6c782548ec9b7445bdde6491b69e82c6/Results/cm_mlp.png)

### Overall: 

The tree-based models achieved the most accurate results overall, showing a more balanced performance (despite using only for these models imbalanced data) and predicting more accurately confirmed exoplanets as well as false positives.
Models’ optimization: Hyperparameter tuning can be optimized by implementing other tools which could lead to improve accuracy, robustness and more confident decisions.

For a more technical report please [click here](https://github.com/ruizmielesmauricio/exoplanets-ml/blob/98d4584e6c782548ec9b7445bdde6491b69e82c6/Results/Mauricio_Ruiz_Report.pdf.pdf) - [Full REPO](https://github.com/ruizmielesmauricio/exoplanets-ml/)
