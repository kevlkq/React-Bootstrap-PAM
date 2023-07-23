from sklearn.ensemble import RandomForestRegressor
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
import joblib
import sys
from sklearn.metrics import mean_squared_error
import joblib
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import MinMaxScaler

model_path = r'C:\Users\luake\Github\React_PAM\Server\models\random_forest_model.joblib'
model = joblib.load(model_path)
csv_file_path = sys.argv[1]
output_csv_path = r'C:\Users\luake\Github\React_PAM\Server\Predictions\predicted_results_Random_Forest.csv'
df = pd.read_csv(csv_file_path)

x_columns = df.columns
x_values = df[x_columns]

sc = MinMaxScaler()
x_scaled = sc.fit_transform(x_values)


y_predicted = model.predict(x_scaled)
df['RUL_Prediction'] = y_predicted

output_csv_file_path = 'Predictions/predicted_results_RandomForest.csv'
df.to_csv(output_csv_file_path, index=False)

print("Predictions saved to predicted_results_RandomForest.csv")

