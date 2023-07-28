import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
import joblib
import sys
from sklearn.metrics import mean_squared_error
import joblib
from sklearn.svm import SVR
from sklearn.preprocessing import StandardScaler

model_path = r'C:\Users\luake\Github\React-Bootstrap-PAM\Server\models\svm_model.joblib'
model = joblib.load(model_path)
csv_file_path = sys.argv[1]
output_csv_path = r'C:\Users\luake\Github\React-Bootstrap-PAM\Server\Predictions\predicted_results_SVM.csv'
df = pd.read_csv(csv_file_path)

x_columns = df.columns
x_values = df[x_columns]

scaler = StandardScaler()
x_scaled = scaler.fit_transform(x_values)

y_predicted = model.predict(x_scaled)
df['RUL_Prediction'] = y_predicted

output_csv_file_path = 'Predictions/predicted_results_SVM.csv'
df.to_csv(output_csv_file_path, index=False)

print("Predictions saved to predicted_results_SVM.csv")
    
