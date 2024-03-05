from sklearn.ensemble import IsolationForest


def OutlierDetection(df):
    '''
    Outliers can arise from input errors, chance, or errors in calculation, and are abnormal data
    Construct an isolation forest to do the outlier detection
    The scores that deviate from most data will be considered as outliers
    '''
    # consider values of one percent of the total as outliers
    outliers_fraction = 0.01
    n_samples = df.shape[0]
    # train the model
    model = IsolationForest(n_estimators=256, max_samples=n_samples, contamination=outliers_fraction, max_features=1.0)
    model.fit(df[['value']])
    df['anomaly_score'] = model.decision_function(df[['value']])
    # predict the result
    df['anomaly'] = model.predict(df[['value']])
    # obtain the data without outliers
    data_c = df.loc[df['anomaly'] == 1]
    return data_c
